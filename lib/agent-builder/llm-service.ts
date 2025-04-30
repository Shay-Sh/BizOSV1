import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { EmailData } from './gmail-service';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export interface ClassificationResult {
  category: string;
  confidence: number;
  reasoning: string;
}

export interface LLMProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  models: string[];
}

export const PROVIDERS: Record<string, LLMProvider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  },
};

export interface ClassificationOptions {
  model: string;
  provider: string;
  categories: string[];
  systemPrompt?: string;
}

/**
 * LLM Service for agent builder
 * Integrates with OpenAI and Anthropic models for email classification and processing
 */
export class LLMService {
  private apiKeys: {
    openai?: string;
    anthropic?: string;
  } = {};

  /**
   * Create a new LLM service instance
   * @param openaiApiKey OpenAI API key
   * @param anthropicApiKey Anthropic API key
   */
  constructor(openaiApiKey?: string, anthropicApiKey?: string) {
    if (openaiApiKey) {
      this.apiKeys.openai = openaiApiKey;
    }
    
    if (anthropicApiKey) {
      this.apiKeys.anthropic = anthropicApiKey;
    }
  }

  /**
   * Classify text into one of the provided categories
   * @param prompt The prompt containing the text to classify
   * @param model The model to use for classification
   * @param categories Available categories for classification
   * @returns The classified category
   */
  public async classifyText(
    prompt: string,
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-haiku' | 'claude-3-sonnet',
    categories: string[]
  ): Promise<string> {
    // Check if we're in a test environment
    if (process.env.NODE_ENV === 'test' || process.env.MOCK_LLM === 'true') {
      // For testing, return a deterministic result based on the content
      return this.mockClassify(prompt, categories);
    }

    try {
      if (model.startsWith('gpt')) {
        return await this.classifyWithOpenAI(prompt, model as 'gpt-3.5-turbo' | 'gpt-4', categories);
      } else if (model.startsWith('claude')) {
        return await this.classifyWithAnthropic(prompt, model as 'claude-3-haiku' | 'claude-3-sonnet', categories);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      console.error('Error in LLM classification:', error);
      
      // Return a fallback category in case of error
      if (categories.length > 0) {
        return categories[0];
      }
      
      throw error;
    }
  }

  /**
   * Classify text using OpenAI models
   * @param prompt Prompt with text to classify
   * @param model OpenAI model to use
   * @param categories Available categories
   * @returns Classified category
   */
  private async classifyWithOpenAI(
    prompt: string,
    model: 'gpt-3.5-turbo' | 'gpt-4',
    categories: string[]
  ): Promise<string> {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKeys.openai}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an email classification assistant. Classify the email into exactly one of these categories: ${categories.join(', ')}. Only respond with the category name, nothing else.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content?.trim() || '';
    
    // Validate the result is one of the expected categories
    if (categories.includes(result)) {
      return result;
    } else {
      // Try to find a closest match
      const closestMatch = categories.find(c => 
        result.toLowerCase().includes(c.toLowerCase())
      );
      
      if (closestMatch) {
        return closestMatch;
      }
      
      // Fall back to the first category
      return categories[0];
    }
  }

  /**
   * Classify text using Anthropic models
   * @param prompt Prompt with text to classify
   * @param model Anthropic model to use
   * @param categories Available categories
   * @returns Classified category
   */
  private async classifyWithAnthropic(
    prompt: string,
    model: 'claude-3-haiku' | 'claude-3-sonnet',
    categories: string[]
  ): Promise<string> {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKeys.anthropic,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        system: `You are an email classification assistant. Classify the email into exactly one of these categories: ${categories.join(', ')}. Only respond with the category name, nothing else.`,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const result = data.content?.[0]?.text?.trim() || '';
    
    // Validate the result is one of the expected categories
    if (categories.includes(result)) {
      return result;
    } else {
      // Try to find a closest match
      const closestMatch = categories.find(c => 
        result.toLowerCase().includes(c.toLowerCase())
      );
      
      if (closestMatch) {
        return closestMatch;
      }
      
      // Fall back to the first category
      return categories[0];
    }
  }

  /**
   * Mock classification for testing
   * @param prompt Prompt with text to classify
   * @param categories Available categories
   * @returns Classified category
   */
  private mockClassify(prompt: string, categories: string[]): string {
    // Use content to deterministically choose a category
    const lowerPrompt = prompt.toLowerCase();
    
    // Words that might indicate different categories
    const categoryIndicators: Record<string, string[]> = {
      'Important': ['urgent', 'important', 'critical', 'attention', 'required', 'action'],
      'Not Important': ['newsletter', 'subscription', 'update', 'weekly'],
      'Urgent': ['urgent', 'immediately', 'asap', 'emergency', 'deadline'],
      'Spam': ['congratulations', 'winner', 'prize', 'lottery', 'offer', 'discount', 'free'],
      'Newsletter': ['newsletter', 'subscribe', 'update', 'weekly', 'monthly'],
      'Update': ['update', 'status', 'progress', 'report'],
      'Personal': ['friend', 'family', 'personal', 'vacation', 'birthday', 'weekend'],
      'Work': ['project', 'meeting', 'deadline', 'client', 'team', 'manager', 'report']
    };
    
    // Check for indicators for each category
    for (const category of categories) {
      if (categoryIndicators[category]) {
        for (const indicator of categoryIndicators[category]) {
          if (lowerPrompt.includes(indicator)) {
            return category;
          }
        }
      }
    }
    
    // If no indicators found, use content length to deterministically select a category
    return categories[prompt.length % categories.length];
  }

  /**
   * Set API keys
   * @param openaiApiKey OpenAI API key
   * @param anthropicApiKey Anthropic API key
   */
  public setApiKeys(openaiApiKey?: string, anthropicApiKey?: string): void {
    if (openaiApiKey) {
      this.apiKeys.openai = openaiApiKey;
    }
    
    if (anthropicApiKey) {
      this.apiKeys.anthropic = anthropicApiKey;
    }
  }

  /**
   * Get API key for the specified provider
   */
  private async getApiKey(provider: string) {
    const { data, error } = await supabase
      .from('llm_api_keys')
      .select('api_key')
      .eq('provider', provider)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      throw new Error(`No active API key found for provider ${provider}`);
    }
    
    return data.api_key;
  }
  
  /**
   * Classify an email using an LLM
   */
  async classifyEmail(
    email: EmailData,
    options: ClassificationOptions
  ): Promise<ClassificationResult> {
    const { provider, model, categories, systemPrompt } = options;
    
    if (!PROVIDERS[provider]) {
      throw new Error(`Unknown provider: ${provider}`);
    }
    
    const providerInfo = PROVIDERS[provider];
    if (!providerInfo.models.includes(model)) {
      throw new Error(`Model ${model} not supported by provider ${provider}`);
    }
    
    const apiKey = await this.getApiKey(provider);
    
    try {
      if (provider === 'openai') {
        return await this.classifyWithOpenAI(email, apiKey, model, categories, systemPrompt);
      } else if (provider === 'anthropic') {
        return await this.classifyWithAnthropic(email, apiKey, model, categories, systemPrompt);
      } else {
        throw new Error(`Provider ${provider} not implemented`);
      }
    } catch (error) {
      console.error('Error classifying email:', error);
      throw error;
    }
  }
  
  /**
   * Get available LLM providers
   */
  getProviders(): LLMProvider[] {
    return Object.values(PROVIDERS);
  }
  
  /**
   * Test LLM connection with API key
   */
  async testConnection(provider: string, apiKey: string): Promise<boolean> {
    try {
      if (provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        return response.ok;
      } else if (provider === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/models', {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
        });
        return response.ok;
      }
      return false;
    } catch (error) {
      console.error(`Error testing connection to ${provider}:`, error);
      return false;
    }
  }
}

export default LLMService; 