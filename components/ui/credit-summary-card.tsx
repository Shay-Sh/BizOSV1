"use client"

import React from 'react'
import { BarChart2, TrendingUp, Battery, AlertTriangle } from 'lucide-react'
import { Button } from './button'

export interface CreditUsage {
  id: string
  date: string
  action: string
  amount: number
  balance: number
}

interface CreditSummaryCardProps {
  credits: number
  usageHistory?: CreditUsage[]
  onPurchaseClick: () => void
}

export function CreditSummaryCard({
  credits,
  usageHistory = [],
  onPurchaseClick
}: CreditSummaryCardProps) {
  // Get last 3 usage records
  const recentUsage = usageHistory.slice(0, 3)
  
  // Calculate credit status
  const getCreditStatus = (credits: number) => {
    if (credits < 100) return 'low'
    if (credits < 500) return 'medium'
    return 'high'
  }
  
  const status = getCreditStatus(credits)
  
  return (
    <div className="bg-card rounded-lg shadow-sm border h-full">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">Credit Balance</h3>
          <Button size="sm" onClick={onPurchaseClick}>
            Purchase Credits
          </Button>
        </div>
        
        <div className="mt-6 flex items-center gap-4">
          <div className="text-4xl font-bold">
            {credits.toLocaleString()}
          </div>
          <div className="flex items-center">
            <Battery className={`h-5 w-5 ${
              status === 'low' ? 'text-destructive' : 
              status === 'medium' ? 'text-amber-500' : 
              'text-green-500'
            } mr-1.5`} />
            <span className={`text-sm font-medium ${
              status === 'low' ? 'text-destructive' : 
              status === 'medium' ? 'text-amber-500' : 
              'text-green-500'
            }`}>
              {status === 'low' ? 'Low balance' : 
               status === 'medium' ? 'Sufficient' : 
               'Healthy balance'}
            </span>
          </div>
        </div>
        
        {status === 'low' && (
          <div className="mt-3 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
            <AlertTriangle className="h-4 w-4" />
            <span>Low credit balance may limit your activities. Consider purchasing more credits.</span>
          </div>
        )}
      </div>
      
      {usageHistory.length > 0 && (
        <div className="border-t p-5">
          <h4 className="font-medium flex items-center gap-1.5 mb-3">
            <BarChart2 className="h-4 w-4" />
            Recent Usage
          </h4>
          <div className="space-y-3">
            {recentUsage.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.action}</span>
                  <div className="text-xs text-muted-foreground">{item.date}</div>
                </div>
                <div className="flex items-center">
                  <span className="text-destructive font-medium">-{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>30-day usage trend</span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 font-normal">
              View All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 