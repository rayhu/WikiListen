require('dotenv').config();

import {OpenAiService} from '../OpenAiService';

describe('OpenAiService', () => {
  let openaiInstance: OpenAiService;
  beforeAll(async () => {});
  beforeEach(() => {
    openaiInstance = OpenAiService.getInstance();
  });

  it('should create an instance of OpenAiService', () => {
    expect(openaiInstance).toBeInstanceOf(OpenAiService);
  });

  // To save API cost, this can be tested manually by running ts-node /.scripts/chatWithGpt.ts
  // it('should get completion from OpenAI', async () => {
  //   const content = 'Hello';
  //   const result = await openaiInstance.getCompletion(content);
  //   console.log(JSON.stringify(result, null, 2));
  //   expect(result).toHaveProperty('id');
  //   expect(result).toHaveProperty('object', 'chat.completion');
  //   expect(result).toHaveProperty('choices');
  // }, 30000);
});
