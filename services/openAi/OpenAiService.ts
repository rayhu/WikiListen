import OpenAI from 'openai';
import Bottleneck from 'bottleneck';
import {ConfigurationManager} from '../configurationManager/ConfigurationManager';
export class OpenAiService {
  private static instance: OpenAiService | null = null;

  // inject the ConfigManager class which has a few static methods
  private ConfigManager: typeof ConfigurationManager;

  private openai: OpenAI;
  private rateLimitedCompletion: (
    content: string,
    model?: string,
  ) => Promise<OpenAI.Chat.ChatCompletion>;

  private constructor(ConfigManager: typeof ConfigurationManager) {
    this.ConfigManager = ConfigManager;
    const apiKey = this.ConfigManager.getConfig('openAi.apiKey');
    const rateLimiterConfig =
      this.ConfigManager.getConfig('openAi.rateLimiter');
    this.openai = new OpenAI({apiKey});

    const limiter = new Bottleneck(rateLimiterConfig);
    this.rateLimitedCompletion = limiter.wrap(this.completion.bind(this));
  }

  public static getInstance(
    ConfigManager: typeof ConfigurationManager,
  ): OpenAiService {
    if (!this.instance) {
      this.instance = new OpenAiService(ConfigManager);
    }
    return this.instance;
  }

  private async completion(
    content: string,
    model: string = this.ConfigManager.getConfig(
      'openAi.defaultModel',
      'gpt-3.5-turbo',
    ),
  ): Promise<OpenAI.Chat.ChatCompletion> {
    return this.openai.chat.completions.create({
      messages: [{role: 'user', content}],
      model,
    });
  }

  public async getCompletion(
    content: string,
    model?: string,
  ): Promise<OpenAI.Chat.ChatCompletion> {
    return this.rateLimitedCompletion(content, model);
  }
}
