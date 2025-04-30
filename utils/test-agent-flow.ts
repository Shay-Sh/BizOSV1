import { NodeType } from '@/lib/agent-builder/engine';
import { MockGmailService, MockGmailEmail } from '@/lib/agent-builder/mock-gmail-service';
import { LLMService } from '@/lib/agent-builder/llm-service';

export interface TestFlowConfig {
  id: string;
  name: string;
  triggerConfig: {
    type: 'gmail';
    query?: string;
    maxResults?: number;
  };
  classifierConfig: {
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-haiku' | 'claude-3-sonnet';
    categories: string[];
    customPrompt?: string;
  };
  actionConfigs: {
    [category: string]: {
      actionType: 'label' | 'archive' | 'move';
      labelName?: string;
    };
  };
}

export interface TestResultEmail {
  email: MockGmailEmail;
  classification: string;
  action: string;
  actionDetails: string;
  success: boolean;
  error?: string;
}

export interface TestFlowResult {
  testId: string;
  timestamp: Date;
  flowConfig: TestFlowConfig;
  processedEmails: TestResultEmail[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    byCategory: { [category: string]: number };
    byAction: { [action: string]: number };
  };
  duration: number; // in milliseconds
  error?: string;
}

/**
 * Utility class for testing agent flows
 */
export class TestAgentFlow {
  private mockGmailService: MockGmailService;
  private llmService: LLMService;
  private config: TestFlowConfig;

  constructor(
    config: TestFlowConfig,
    mockGmailService?: MockGmailService,
    llmService?: LLMService
  ) {
    this.config = config;
    this.mockGmailService = mockGmailService || new MockGmailService({ simulateAuth: true });
    this.llmService = llmService || new LLMService();
  }

  /**
   * Run the test flow
   * @returns Result of the test run
   */
  public async runTest(): Promise<TestFlowResult> {
    const startTime = Date.now();
    const testId = `test-${Date.now()}`;
    const processedEmails: TestResultEmail[] = [];
    const summary = {
      total: 0,
      successful: 0,
      failed: 0,
      byCategory: {} as { [category: string]: number },
      byAction: {} as { [action: string]: number }
    };

    try {
      // 1. Fetch emails based on trigger configuration
      const emails = await this.mockGmailService.getEmails(
        this.config.triggerConfig.query,
        this.config.triggerConfig.maxResults || 10
      );

      // 2. Process each email
      for (const email of emails) {
        try {
          // 3. Classify email
          const classification = await this.classifyEmail(email);
          let action = 'none';
          let actionDetails = '';
          let success = true;
          let error: string | undefined;

          // 4. Determine and execute action based on classification
          if (classification && this.config.actionConfigs[classification]) {
            const actionConfig = this.config.actionConfigs[classification];
            
            try {
              if (actionConfig.actionType === 'label' && actionConfig.labelName) {
                // Find or create the label
                const labels = await this.mockGmailService.getLabels();
                let labelId = labels.find(l => l.name === actionConfig.labelName)?.id;
                
                if (!labelId) {
                  const newLabel = await this.mockGmailService.createLabel(actionConfig.labelName);
                  labelId = newLabel.id;
                }
                
                // Apply the label
                await this.mockGmailService.modifyLabels(email.id, [labelId], []);
                
                action = 'label';
                actionDetails = `Applied label: ${actionConfig.labelName}`;
              } else if (actionConfig.actionType === 'archive') {
                // Archive the email
                await this.mockGmailService.archiveEmail(email.id);
                
                action = 'archive';
                actionDetails = 'Email archived';
              } else if (actionConfig.actionType === 'move' && actionConfig.labelName) {
                // Find the destination folder/label
                const labels = await this.mockGmailService.getLabels();
                const labelId = labels.find(l => l.name === actionConfig.labelName)?.id;
                
                if (labelId) {
                  // Remove INBOX label and add the destination label
                  await this.mockGmailService.modifyLabels(email.id, [labelId], ['INBOX']);
                  
                  action = 'move';
                  actionDetails = `Moved to: ${actionConfig.labelName}`;
                } else {
                  throw new Error(`Destination label not found: ${actionConfig.labelName}`);
                }
              }
            } catch (actionError) {
              success = false;
              error = actionError instanceof Error ? actionError.message : 'Unknown action error';
              console.error('Action error:', actionError);
            }
          }

          // 5. Record the result
          processedEmails.push({
            email,
            classification,
            action,
            actionDetails,
            success,
            error
          });

          // 6. Update summary statistics
          summary.total++;
          
          if (success) {
            summary.successful++;
          } else {
            summary.failed++;
          }
          
          if (classification) {
            summary.byCategory[classification] = (summary.byCategory[classification] || 0) + 1;
          }
          
          if (action !== 'none') {
            summary.byAction[action] = (summary.byAction[action] || 0) + 1;
          }
        } catch (emailError) {
          // Record error for this email
          processedEmails.push({
            email,
            classification: 'ERROR',
            action: 'none',
            actionDetails: '',
            success: false,
            error: emailError instanceof Error ? emailError.message : 'Unknown error'
          });
          
          summary.total++;
          summary.failed++;
        }
      }

      const duration = Date.now() - startTime;
      
      return {
        testId,
        timestamp: new Date(),
        flowConfig: this.config,
        processedEmails,
        summary,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testId,
        timestamp: new Date(),
        flowConfig: this.config,
        processedEmails,
        summary,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error running test flow'
      };
    }
  }

  /**
   * Classify an email using the LLM service
   * @param email Email to classify
   * @returns Classification result
   */
  private async classifyEmail(email: MockGmailEmail): Promise<string> {
    const { model, categories, customPrompt } = this.config.classifierConfig;
    
    const emailContent = `
Subject: ${email.subject}
From: ${email.from}
Date: ${email.date.toISOString()}
Snippet: ${email.snippet}
Body:
${email.body}
    `.trim();

    // Build prompt for classification
    let prompt = customPrompt;
    if (!prompt) {
      prompt = `
Classify the following email into exactly one of these categories: ${categories.join(', ')}.
Your response should be just the category name, nothing else.

EMAIL:
${emailContent}
      `.trim();
    }

    // Call LLM service to classify
    const classification = await this.llmService.classifyText(
      prompt,
      model,
      categories
    );
    
    return classification;
  }

  /**
   * Add test emails to the mock Gmail service
   * @param emails Emails to add
   */
  public addTestEmails(emails: Partial<MockGmailEmail>[]): MockGmailEmail[] {
    return emails.map(email => this.mockGmailService.addTestEmail(email));
  }

  /**
   * Get the mock Gmail service
   * @returns Mock Gmail service
   */
  public getMockGmailService(): MockGmailService {
    return this.mockGmailService;
  }

  /**
   * Get the LLM service
   * @returns LLM service
   */
  public getLLMService(): LLMService {
    return this.llmService;
  }

  /**
   * Create a test configuration based on a simplified spec
   * @param name Flow name
   * @param categories Categories for classification
   * @param actions Actions to take for each category
   * @returns Test flow configuration
   */
  public static createConfig(
    name: string,
    categories: string[],
    actions: {
      [category: string]: {
        actionType: 'label' | 'archive' | 'move';
        labelName?: string;
      };
    }
  ): TestFlowConfig {
    return {
      id: `flow-${Date.now()}`,
      name,
      triggerConfig: {
        type: 'gmail',
        maxResults: 10
      },
      classifierConfig: {
        model: 'gpt-3.5-turbo',
        categories
      },
      actionConfigs: actions
    };
  }
} 