import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { addMinutes, addHours, addDays, addWeeks, addMonths, isBefore } from 'date-fns';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export interface Schedule {
  id: string;
  agentId: string;
  frequency: 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  interval: number;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
}

class SchedulerService {
  /**
   * Create a new schedule for an agent
   */
  async createSchedule(
    agentId: string,
    frequency: 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
    interval: number
  ): Promise<Schedule> {
    // Calculate the next run time
    const nextRunAt = this.calculateNextRun(null, frequency, interval);
    
    // Store in database
    const { data, error } = await supabase
      .from('agent_schedules')
      .insert({
        agent_id: agentId,
        frequency,
        interval,
        is_active: true,
        next_run_at: nextRunAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Failed to create schedule: ${error.message}`);
    }
    
    return {
      id: data.id,
      agentId: data.agent_id,
      frequency: data.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      interval: data.interval,
      isActive: data.is_active,
      lastRunAt: data.last_run_at,
      nextRunAt: data.next_run_at,
    };
  }
  
  /**
   * Update an existing schedule
   */
  async updateSchedule(
    scheduleId: string,
    updates: Partial<{
      frequency: 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly';
      interval: number;
      isActive: boolean;
    }>
  ): Promise<Schedule> {
    // Get the current schedule
    const { data: currentSchedule, error: fetchError } = await supabase
      .from('agent_schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();
    
    if (fetchError) {
      throw new Error(`Failed to fetch schedule: ${fetchError.message}`);
    }
    
    // Prepare updates
    const updatedData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (updates.frequency !== undefined) {
      updatedData.frequency = updates.frequency;
    }
    
    if (updates.interval !== undefined) {
      updatedData.interval = updates.interval;
    }
    
    if (updates.isActive !== undefined) {
      updatedData.is_active = updates.isActive;
    }
    
    // If frequency or interval changed, recalculate next run time
    if (updates.frequency !== undefined || updates.interval !== undefined) {
      const frequency = updates.frequency || currentSchedule.frequency;
      const interval = updates.interval || currentSchedule.interval;
      
      const nextRunAt = this.calculateNextRun(
        new Date(),
        frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
        interval
      );
      
      updatedData.next_run_at = nextRunAt.toISOString();
    }
    
    // Update in database
    const { data, error } = await supabase
      .from('agent_schedules')
      .update(updatedData)
      .eq('id', scheduleId)
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
    
    return {
      id: data.id,
      agentId: data.agent_id,
      frequency: data.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      interval: data.interval,
      isActive: data.is_active,
      lastRunAt: data.last_run_at,
      nextRunAt: data.next_run_at,
    };
  }
  
  /**
   * Delete a schedule
   */
  async deleteSchedule(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .from('agent_schedules')
      .delete()
      .eq('id', scheduleId);
    
    if (error) {
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }
  }
  
  /**
   * Get all schedules for an agent
   */
  async getSchedulesForAgent(agentId: string): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from('agent_schedules')
      .select('*')
      .eq('agent_id', agentId);
    
    if (error) {
      throw new Error(`Failed to fetch schedules: ${error.message}`);
    }
    
    return (data || []).map(item => ({
      id: item.id,
      agentId: item.agent_id,
      frequency: item.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      interval: item.interval,
      isActive: item.is_active,
      lastRunAt: item.last_run_at,
      nextRunAt: item.next_run_at,
    }));
  }
  
  /**
   * Get all due schedules (schedules that need to be run now)
   */
  async getDueSchedules(): Promise<Schedule[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('agent_schedules')
      .select('*')
      .eq('is_active', true)
      .lt('next_run_at', now);
    
    if (error) {
      throw new Error(`Failed to fetch due schedules: ${error.message}`);
    }
    
    return (data || []).map(item => ({
      id: item.id,
      agentId: item.agent_id,
      frequency: item.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      interval: item.interval,
      isActive: item.is_active,
      lastRunAt: item.last_run_at,
      nextRunAt: item.next_run_at,
    }));
  }
  
  /**
   * Mark a schedule as having been run and calculate the next run time
   */
  async markScheduleRun(scheduleId: string): Promise<Schedule> {
    // Get the current schedule
    const { data: currentSchedule, error: fetchError } = await supabase
      .from('agent_schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();
    
    if (fetchError) {
      throw new Error(`Failed to fetch schedule: ${fetchError.message}`);
    }
    
    const now = new Date();
    const nextRunAt = this.calculateNextRun(
      now,
      currentSchedule.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      currentSchedule.interval
    );
    
    // Update in database
    const { data, error } = await supabase
      .from('agent_schedules')
      .update({
        last_run_at: now.toISOString(),
        next_run_at: nextRunAt.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', scheduleId)
      .select('*')
      .single();
    
    if (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
    
    return {
      id: data.id,
      agentId: data.agent_id,
      frequency: data.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      interval: data.interval,
      isActive: data.is_active,
      lastRunAt: data.last_run_at,
      nextRunAt: data.next_run_at,
    };
  }
  
  /**
   * Calculate the next run time based on frequency and interval
   */
  private calculateNextRun(
    lastRun: Date | null,
    frequency: 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
    interval: number
  ): Date {
    const base = lastRun || new Date();
    
    switch (frequency) {
      case 'minutes':
        return addMinutes(base, interval);
      case 'hourly':
        return addHours(base, interval);
      case 'daily':
        return addDays(base, interval);
      case 'weekly':
        return addWeeks(base, interval);
      case 'monthly':
        return addMonths(base, interval);
      default:
        throw new Error(`Unknown frequency: ${frequency}`);
    }
  }
  
  /**
   * Get all active schedules that have agents
   */
  async getAllActiveSchedules(): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from('agent_schedules')
      .select('*, agent_flows(id)')
      .eq('is_active', true);
    
    if (error) {
      throw new Error(`Failed to fetch active schedules: ${error.message}`);
    }
    
    // Filter out schedules for deleted agents
    const validSchedules = (data || []).filter(item => item.agent_flows);
    
    return validSchedules.map(item => ({
      id: item.id,
      agentId: item.agent_id,
      frequency: item.frequency as 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      interval: item.interval,
      isActive: item.is_active,
      lastRunAt: item.last_run_at,
      nextRunAt: item.next_run_at,
    }));
  }
}

export default new SchedulerService(); 