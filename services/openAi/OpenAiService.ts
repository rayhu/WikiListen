import OpenAI from 'openai';
import Bottleneck from 'bottleneck';
import {ConfigurationManager} from '../configurationManager/ConfigurationManager';

export class OpenAIService {
  private static instance: OpenAIService;
  private openai: any;
  private rateLimitedCompletion: any;

  private constructor() {
    const apiKey = ConfigurationManager.getConfig('openAi.apiKey');
    const rateLimiter = ConfigurationManager.getConfig('openAi.rateLimiter');
    this.openai = new OpenAI({apiKey});
    const limiter: Bottleneck = new Bottleneck(rateLimiter);
    this.rateLimitedCompletion = limiter.wrap(this.completion.bind(this));
  }

  public static getInstance(): OpenAIService {
    if (!this.instance) {
      this.instance = new OpenAIService();
    }
    return this.instance;
  }

  private async completion(
    content: string,
    model?: string,
  ): Promise<OpenAI.Chat.ChatCompletion> {
    if (!model) {
      model = ConfigurationManager.getConfig(
        'openAi.defaultModel',
        'gpt-3.5-turbo',
      );
    }
    return this.openai.chat.completions.create({
      messages: [{role: 'user', content}],
      model: model,
    });
  }

  public async getCompletion(content: string, model?: string) {
    return this.rateLimitedCompletion(content, model);
  }
}
