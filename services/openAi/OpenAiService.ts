import OpenAI from 'openai';
import Bottleneck from 'bottleneck';
import {config} from '../../config/config';

export class OpenAiService {
  private static instance: OpenAiService | null = null;

  private openai: OpenAI;
  private rateLimitedCompletion: (
    content: string,
    model?: string,
  ) => Promise<OpenAI.Chat.ChatCompletion>;

  private apiKey = config.openAi.apiKey;
  private rateLimiterConfig = config.openAi.rateLimiter;

  constructor() {
    this.openai = new OpenAI({apiKey: this.apiKey});

    const limiter = new Bottleneck(this.rateLimiterConfig);
    this.rateLimitedCompletion = limiter.wrap(this.completion.bind(this));
  }

  public static getInstance(): OpenAiService {
    if (!this.instance) {
      this.instance = new OpenAiService();
    }
    return this.instance;
  }

  private async completion(
    content: string,
    model: string = config.openAi.defaultModel || 'gpt-4o',
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
