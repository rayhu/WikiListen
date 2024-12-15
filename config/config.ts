import * as env from '../bin/env';

export const config = {
  openAi: {
    apiKey: env.OPENAI_API_KEY,
    chatGpt: {
      defaultModel: 'gpt-4o',
    },
    rateLimiter: {
      minTime: 10000, // 10 seconds
      maxConcurrent: 1,
    },
  },
  voice: {
    default: {
      ios: 'com.apple.voice.compact.en-US.Samantha',
      android: 'en-us-x-tpf-local',
    },
  },
};
