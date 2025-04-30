import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

interface GmailEmail {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
    body?: {
      data?: string;
    };
    parts?: {
      mimeType: string;
      body: {
        data?: string;
      };
    }[];
  };
  internalDate: string;
}

export interface EmailData {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  snippet: string;
  labelIds: string[];
}

export interface GmailLabel {
  id: string;
  name: string;
  type: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
  color?: {
    textColor: string;
    backgroundColor: string;
  };
}

class GmailService {
  private async getTokens(userId: string) {
    const { data: token, error } = await supabase
      .from('gmail_auth_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !token) {
      throw new Error(`Unable to retrieve Gmail tokens: ${error?.message || 'No tokens found'}`);
    }
    
    // Check if the token is expired
    if (new Date(token.expires_at) <= new Date()) {
      // Token is expired, refresh it
      return this.refreshToken(token);
    }
    
    return token;
  }
  
  private async refreshToken(token: Database['public']['Tables']['gmail_auth_tokens']['Row']) {
    const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || '';
    const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || '';
    
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GMAIL_CLIENT_ID,
          client_secret: GMAIL_CLIENT_SECRET,
          refresh_token: token.refresh_token,
          grant_type: 'refresh_token',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Calculate new expiration time
      const expiresIn = data.expires_in || 3600; // Default to 1 hour
      const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
      
      // Update the token in the database
      const { error } = await supabase
        .from('gmail_auth_tokens')
        .update({
          access_token: data.access_token,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', token.id);
      
      if (error) {
        throw new Error(`Failed to update refreshed token: ${error.message}`);
      }
      
      // Return the updated token
      return {
        ...token,
        access_token: data.access_token,
        expires_at: expiresAt,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  /**
   * Fetch recent emails from Gmail
   */
  async getRecentEmails(userId: string, maxResults: number = 10): Promise<EmailData[]> {
    try {
      const token = await this.getTokens(userId);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
        {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch emails: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.messages || !data.messages.length) {
        return [];
      }
      
      // Fetch the full details of each email
      const emails: EmailData[] = await Promise.all(
        data.messages.map(async (message: { id: string }) => {
          const emailData = await this.getEmail(userId, message.id);
          return emailData;
        })
      );
      
      return emails;
    } catch (error) {
      console.error('Error fetching recent emails:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific email by ID
   */
  async getEmail(userId: string, emailId: string): Promise<EmailData> {
    try {
      const token = await this.getTokens(userId);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
        {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch email: ${response.statusText}`);
      }
      
      const email: GmailEmail = await response.json();
      
      // Extract relevant data from the email
      const getHeader = (name: string) => {
        const header = email.payload.headers.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header ? header.value : '';
      };
      
      // Extract the body content
      let body = '';
      
      if (email.payload.body?.data) {
        // If the body is directly in the payload
        body = Buffer.from(email.payload.body.data, 'base64').toString('utf-8');
      } else if (email.payload.parts) {
        // If the body is in parts (multipart email)
        const textPart = email.payload.parts.find(part => 
          part.mimeType === 'text/plain' || part.mimeType === 'text/html'
        );
        
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }
      
      return {
        id: email.id,
        threadId: email.threadId,
        subject: getHeader('subject'),
        from: getHeader('from'),
        to: getHeader('to'),
        date: getHeader('date'),
        body,
        snippet: email.snippet,
        labelIds: email.labelIds || [],
      };
    } catch (error) {
      console.error(`Error fetching email ${emailId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all Gmail labels for the user
   */
  async getLabels(userId: string): Promise<GmailLabel[]> {
    try {
      const token = await this.getTokens(userId);
      
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/labels',
        {
          headers: {
            Authorization: `${token.token_type} ${token.access_token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch labels: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.labels || [];
    } catch (error) {
      console.error('Error fetching labels:', error);
      throw error;
    }
  }
  
  /**
   * Create a new Gmail label
   */
  async createLabel(userId: string, name: string, options?: Partial<GmailLabel>): Promise<GmailLabel> {
    try {
      const token = await this.getTokens(userId);
      
      const labelData = {
        name,
        messageListVisibility: 'show',
        labelListVisibility: 'labelShow',
        ...options
      };
      
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/labels',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token.token_type} ${token.access_token}`,
          },
          body: JSON.stringify(labelData),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to create label: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating label:', error);
      throw error;
    }
  }
  
  /**
   * Apply a label to an email
   */
  async applyLabel(userId: string, emailId: string, labelId: string): Promise<void> {
    try {
      const token = await this.getTokens(userId);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token.token_type} ${token.access_token}`,
          },
          body: JSON.stringify({
            addLabelIds: [labelId],
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to apply label: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error applying label to email ${emailId}:`, error);
      throw error;
    }
  }
  
  /**
   * Remove a label from an email
   */
  async removeLabel(userId: string, emailId: string, labelId: string): Promise<void> {
    try {
      const token = await this.getTokens(userId);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token.token_type} ${token.access_token}`,
          },
          body: JSON.stringify({
            removeLabelIds: [labelId],
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to remove label: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error removing label from email ${emailId}:`, error);
      throw error;
    }
  }
}

export default new GmailService(); 