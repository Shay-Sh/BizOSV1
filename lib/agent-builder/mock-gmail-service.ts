import { EmailData, GmailLabel } from './gmail-service';
import { randomUUID } from 'crypto';

// Sample test emails for testing
const TEST_EMAILS: EmailData[] = [
  {
    id: 'email-1',
    threadId: 'thread-1',
    subject: 'Meeting tomorrow',
    from: 'john@example.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 3600000).toISOString(),
    body: 'Hello, can we schedule a meeting tomorrow at 2pm to discuss the project? Best regards, John',
    snippet: 'Hello, can we schedule a meeting tomorrow at 2pm to discuss the project?',
    labelIds: ['INBOX']
  },
  {
    id: 'email-2',
    threadId: 'thread-2',
    subject: 'Your invoice #12345',
    from: 'billing@company.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 7200000).toISOString(),
    body: 'Please find attached your invoice #12345 for services rendered. Payment is due within 30 days. Thank you for your business.',
    snippet: 'Please find attached your invoice #12345 for services rendered.',
    labelIds: ['INBOX', 'CATEGORY_UPDATES']
  },
  {
    id: 'email-3',
    threadId: 'thread-3',
    subject: 'Newsletter: Industry Updates',
    from: 'newsletter@industry.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 86400000).toISOString(),
    body: 'Here are this week\'s top stories in your industry:\n\n1. New regulations announced\n2. Technology breakthrough\n3. Market trends',
    snippet: 'Here are this week\'s top stories in your industry:',
    labelIds: ['INBOX', 'CATEGORY_PROMOTIONS']
  },
  {
    id: 'email-4',
    threadId: 'thread-4',
    subject: 'Urgent: Action required',
    from: 'security@service.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 900000).toISOString(),
    body: 'We\'ve detected unusual activity on your account. Please log in to verify your recent transactions and update your password.',
    snippet: 'We\'ve detected unusual activity on your account.',
    labelIds: ['INBOX', 'IMPORTANT']
  },
  {
    id: 'email-5',
    threadId: 'thread-5',
    subject: 'Project status update',
    from: 'team@workspace.com',
    to: 'user@example.com',
    date: new Date(Date.now() - 259200000).toISOString(),
    body: 'Project status: On track\nMilestones achieved: 3/5\nNext steps: Finalize design by Friday\n\nLet me know if you have any questions.',
    snippet: 'Project status: On track. Milestones achieved: 3/5.',
    labelIds: ['INBOX', 'CATEGORY_UPDATES']
  }
];

// Sample test labels
const TEST_LABELS: GmailLabel[] = [
  {
    id: 'INBOX',
    name: 'INBOX',
    type: 'system'
  },
  {
    id: 'IMPORTANT',
    name: 'IMPORTANT',
    type: 'system'
  },
  {
    id: 'CATEGORY_UPDATES',
    name: 'Updates',
    type: 'system'
  },
  {
    id: 'CATEGORY_PROMOTIONS',
    name: 'Promotions',
    type: 'system'
  },
  {
    id: 'Label_1',
    name: 'Work',
    type: 'user',
    color: {
      textColor: '#ffffff',
      backgroundColor: '#4285f4'
    }
  },
  {
    id: 'Label_2',
    name: 'Personal',
    type: 'user',
    color: {
      textColor: '#ffffff',
      backgroundColor: '#42f4aa'
    }
  },
  {
    id: 'Label_3',
    name: 'Urgent',
    type: 'user',
    color: {
      textColor: '#ffffff',
      backgroundColor: '#f44242'
    }
  }
];

// Mock user data for testing
interface MockUserData {
  userId: string;
  emails: Map<string, EmailData>;
  labels: Map<string, GmailLabel>;
}

// Store mock data by user
const mockUsers = new Map<string, MockUserData>();

// Initialize mock data for a user
function initMockUserData(userId: string): MockUserData {
  const emailsMap = new Map<string, EmailData>();
  TEST_EMAILS.forEach(email => {
    emailsMap.set(email.id, { ...email });
  });
  
  const labelsMap = new Map<string, GmailLabel>();
  TEST_LABELS.forEach(label => {
    labelsMap.set(label.id, { ...label });
  });
  
  return { userId, emails: emailsMap, labels: labelsMap };
}

// Types for the mock Gmail service
export interface MockGmailEmail {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  body: string;
  from: string;
  to: string;
  date: Date;
  labelIds: string[];
  isRead: boolean;
  isStarred: boolean;
}

export interface MockGmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  color?: {
    backgroundColor: string;
    textColor: string;
  };
}

/**
 * Mock Gmail Service for testing Gmail agent workflows
 * without accessing the real Gmail API
 */
export class MockGmailService {
  private emails: MockGmailEmail[] = [];
  private labels: MockGmailLabel[] = [];
  private tokenInfo: { accessToken: string, refreshToken: string, expiry: Date } | null = null;
  private errorRate: number = 0; // Simulate API errors at a certain rate (0-1)

  /**
   * Create a new MockGmailService instance
   * @param options Configuration options
   */
  constructor(
    options?: {
      preloadedEmails?: MockGmailEmail[];
      preloadedLabels?: MockGmailLabel[];
      simulateAuth?: boolean;
      errorRate?: number;
    }
  ) {
    // Initialize with preloaded emails if provided
    if (options?.preloadedEmails) {
      this.emails = [...options.preloadedEmails];
    } else {
      this.emails = this.generateDefaultEmails();
    }

    // Initialize with preloaded labels if provided
    if (options?.preloadedLabels) {
      this.labels = [...options.preloadedLabels];
    } else {
      this.labels = this.generateDefaultLabels();
    }

    // Set error rate if provided
    if (options?.errorRate !== undefined) {
      this.errorRate = Math.min(Math.max(options.errorRate, 0), 1);
    }

    // Simulate authentication if requested
    if (options?.simulateAuth) {
      this.simulateAuthentication();
    }
  }

  /**
   * Simulate authentication with Gmail
   * @returns OAuth tokens
   */
  public simulateAuthentication(): { accessToken: string, refreshToken: string, expiry: Date } {
    const accessToken = `mock_access_token_${randomUUID()}`;
    const refreshToken = `mock_refresh_token_${randomUUID()}`;
    const expiry = new Date(Date.now() + 3600 * 1000); // 1 hour from now
    
    this.tokenInfo = { accessToken, refreshToken, expiry };
    return this.tokenInfo;
  }

  /**
   * Check if the service is authenticated
   * @returns Authentication status
   */
  public isAuthenticated(): boolean {
    return !!this.tokenInfo && this.tokenInfo.expiry > new Date();
  }

  /**
   * Simulate fetching emails from Gmail
   * @param query Search query to filter emails
   * @param maxResults Maximum number of results to return
   * @returns List of emails matching the query
   */
  public async getEmails(query?: string, maxResults: number = 10): Promise<MockGmailEmail[]> {
    this.maybeThrowError('Failed to fetch emails');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    let filteredEmails = [...this.emails];
    
    // Apply search query if provided
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredEmails = filteredEmails.filter(email => {
        return (
          email.subject.toLowerCase().includes(lowerQuery) ||
          email.body.toLowerCase().includes(lowerQuery) ||
          email.from.toLowerCase().includes(lowerQuery) ||
          email.to.toLowerCase().includes(lowerQuery) ||
          email.snippet.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Sort by date (newest first)
    filteredEmails.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Limit results
    return filteredEmails.slice(0, maxResults);
  }

  /**
   * Get email by ID
   * @param emailId Email ID
   * @returns Email object if found
   */
  public async getEmail(emailId: string): Promise<MockGmailEmail | null> {
    this.maybeThrowError('Failed to fetch email');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    const email = this.emails.find(e => e.id === emailId);
    return email || null;
  }

  /**
   * Get all labels
   * @returns List of Gmail labels
   */
  public async getLabels(): Promise<MockGmailLabel[]> {
    this.maybeThrowError('Failed to fetch labels');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    return [...this.labels];
  }

  /**
   * Create a new label
   * @param name Label name
   * @returns Created label
   */
  public async createLabel(name: string): Promise<MockGmailLabel> {
    this.maybeThrowError('Failed to create label');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    // Check if label already exists
    if (this.labels.some(l => l.name === name)) {
      throw new Error(`Label '${name}' already exists`);
    }

    const newLabel: MockGmailLabel = {
      id: `Label_${randomUUID().substring(0, 8)}`,
      name,
      type: 'user',
      color: {
        backgroundColor: '#eeeeee',
        textColor: '#666666'
      }
    };

    this.labels.push(newLabel);
    return newLabel;
  }

  /**
   * Modify labels on an email
   * @param emailId Email ID
   * @param addLabelIds Labels to add
   * @param removeLabelIds Labels to remove
   * @returns Updated email
   */
  public async modifyLabels(
    emailId: string, 
    addLabelIds: string[] = [], 
    removeLabelIds: string[] = []
  ): Promise<MockGmailEmail | null> {
    this.maybeThrowError('Failed to modify labels');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    const emailIndex = this.emails.findIndex(e => e.id === emailId);
    if (emailIndex === -1) {
      return null;
    }

    const email = { ...this.emails[emailIndex] };
    
    // Add labels that don't already exist on the email
    addLabelIds.forEach(labelId => {
      if (!email.labelIds.includes(labelId)) {
        email.labelIds.push(labelId);
      }
    });
    
    // Remove specified labels
    email.labelIds = email.labelIds.filter(id => !removeLabelIds.includes(id));
    
    // Update email in the store
    this.emails[emailIndex] = email;
    
    return email;
  }

  /**
   * Archive an email (remove INBOX label)
   * @param emailId Email ID
   * @returns Updated email
   */
  public async archiveEmail(emailId: string): Promise<MockGmailEmail | null> {
    this.maybeThrowError('Failed to archive email');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    return this.modifyLabels(emailId, [], ['INBOX']);
  }

  /**
   * Mark an email as read
   * @param emailId Email ID
   * @returns Updated email
   */
  public async markAsRead(emailId: string): Promise<MockGmailEmail | null> {
    this.maybeThrowError('Failed to mark email as read');
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Gmail');
    }

    const emailIndex = this.emails.findIndex(e => e.id === emailId);
    if (emailIndex === -1) {
      return null;
    }

    const email = { ...this.emails[emailIndex], isRead: true };
    this.emails[emailIndex] = email;
    
    return email;
  }

  /**
   * Add a test email to the mock inbox
   * @param email Email to add
   */
  public addTestEmail(email: Partial<MockGmailEmail>): MockGmailEmail {
    const newEmail: MockGmailEmail = {
      id: email.id || `msg_${randomUUID().substring(0, 8)}`,
      threadId: email.threadId || `thread_${randomUUID().substring(0, 8)}`,
      subject: email.subject || 'Test Subject',
      snippet: email.snippet || 'This is a test email snippet...',
      body: email.body || 'This is the body of a test email.',
      from: email.from || 'sender@example.com',
      to: email.to || 'recipient@example.com',
      date: email.date || new Date(),
      labelIds: email.labelIds || ['INBOX', 'UNREAD'],
      isRead: email.isRead ?? false,
      isStarred: email.isStarred ?? false
    };
    
    this.emails.push(newEmail);
    return newEmail;
  }

  /**
   * Reset the mock service to its initial state
   */
  public reset(): void {
    this.emails = this.generateDefaultEmails();
    this.labels = this.generateDefaultLabels();
    this.tokenInfo = null;
  }

  /**
   * Generate default test emails
   * @returns Array of default test emails
   */
  private generateDefaultEmails(): MockGmailEmail[] {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'msg_urgent_1',
        threadId: 'thread_urgent_1',
        subject: 'URGENT: Action required on your account',
        snippet: 'Please update your payment information by tomorrow to avoid service interruption...',
        body: `Dear User,

We've noticed that your payment method has expired. Please update your payment information by tomorrow to avoid service interruption.

This is an urgent matter that requires your immediate attention.

Best regards,
The Finance Team`,
        from: 'billing@example.com',
        to: 'user@example.com',
        date: yesterday,
        labelIds: ['INBOX', 'UNREAD', 'IMPORTANT'],
        isRead: false,
        isStarred: false
      },
      {
        id: 'msg_newsletter_1',
        threadId: 'thread_newsletter_1',
        subject: 'Your Weekly Tech Newsletter',
        snippet: 'This week in tech: New AI breakthroughs, software releases, and industry news...',
        body: `Hello tech enthusiast,

Here's your weekly roundup of the most important tech news:

1. New AI models show promising results in medical diagnosis
2. Major software company announces new version release
3. Tech industry hiring trends for this quarter

Happy reading!
Tech Weekly Newsletter`,
        from: 'newsletter@techweekly.com',
        to: 'user@example.com',
        date: now,
        labelIds: ['INBOX', 'UNREAD', 'CATEGORY_PROMOTIONS'],
        isRead: false,
        isStarred: false
      },
      {
        id: 'msg_work_1',
        threadId: 'thread_work_1',
        subject: 'Project Update: Q3 Roadmap',
        snippet: 'Hi team, I wanted to share the updated roadmap for our Q3 deliverables...',
        body: `Hi team,

I wanted to share the updated roadmap for our Q3 deliverables. We've made some adjustments based on the feedback from the stakeholder meeting.

Key changes:
- Feature X moved to early Q4
- Additional resources allocated to Feature Y
- New UX improvements prioritized for the next sprint

Let me know if you have any questions.

Best,
Project Manager`,
        from: 'manager@company.com',
        to: 'user@example.com',
        date: yesterday,
        labelIds: ['INBOX', 'CATEGORY_PERSONAL'],
        isRead: true,
        isStarred: true
      },
      {
        id: 'msg_spam_1',
        threadId: 'thread_spam_1',
        subject: 'YOU WON!!! Claim your prize now!',
        snippet: 'Congratulations! You have been selected as the winner of our monthly lottery...',
        body: `CONGRATULATIONS!!!

You have been selected as the winner of our monthly lottery drawing!

You've won $1,000,000! To claim your prize, please reply with your bank account details.

Don't delay - claim now!

Lucky Draws International`,
        from: 'prize@lucky-draws-intl.example',
        to: 'user@example.com',
        date: now,
        labelIds: ['INBOX', 'UNREAD'],
        isRead: false,
        isStarred: false
      },
      {
        id: 'msg_personal_1',
        threadId: 'thread_personal_1',
        subject: 'Vacation plans',
        snippet: 'Hey, I was thinking about our upcoming vacation plans...',
        body: `Hey,

I was thinking about our upcoming vacation plans. How do you feel about changing our destination to the beach instead of the mountains?

I found some great deals for next month. Let me know what you think!

Cheers,
Friend`,
        from: 'friend@personal.com',
        to: 'user@example.com',
        date: lastWeek,
        labelIds: ['INBOX', 'CATEGORY_PERSONAL'],
        isRead: true,
        isStarred: false
      }
    ];
  }

  /**
   * Generate default Gmail labels
   * @returns Array of default Gmail labels
   */
  private generateDefaultLabels(): MockGmailLabel[] {
    return [
      { id: 'INBOX', name: 'INBOX', type: 'system' },
      { id: 'SENT', name: 'SENT', type: 'system' },
      { id: 'TRASH', name: 'TRASH', type: 'system' },
      { id: 'SPAM', name: 'SPAM', type: 'system' },
      { id: 'UNREAD', name: 'UNREAD', type: 'system' },
      { id: 'STARRED', name: 'STARRED', type: 'system' },
      { id: 'IMPORTANT', name: 'IMPORTANT', type: 'system' },
      { id: 'CATEGORY_PERSONAL', name: 'Personal', type: 'system' },
      { id: 'CATEGORY_SOCIAL', name: 'Social', type: 'system' },
      { id: 'CATEGORY_PROMOTIONS', name: 'Promotions', type: 'system' },
      { id: 'CATEGORY_UPDATES', name: 'Updates', type: 'system' },
      { id: 'CATEGORY_FORUMS', name: 'Forums', type: 'system' },
      { 
        id: 'Label_Work', 
        name: 'Work', 
        type: 'user',
        color: { backgroundColor: '#a2dcc1', textColor: '#1e7146' }
      },
      { 
        id: 'Label_Finance', 
        name: 'Finance', 
        type: 'user',
        color: { backgroundColor: '#c2e7ff', textColor: '#0b57d0' }
      },
      { 
        id: 'Label_Important', 
        name: 'Important Tasks', 
        type: 'user',
        color: { backgroundColor: '#f6aea9', textColor: '#b93221' }
      },
      { 
        id: 'Label_Newsletters', 
        name: 'Newsletters', 
        type: 'user',
        color: { backgroundColor: '#fff8c4', textColor: '#695e00' }
      }
    ];
  }
  
  /**
   * Randomly throw an error based on the configured error rate
   * @param message Error message
   */
  private maybeThrowError(message: string): void {
    if (this.errorRate > 0 && Math.random() < this.errorRate) {
      throw new Error(`Mock Gmail API Error: ${message}`);
    }
  }
}

export default new MockGmailService(); 