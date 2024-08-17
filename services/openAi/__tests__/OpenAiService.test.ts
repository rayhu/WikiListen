require('dotenv').config();

import fs from 'fs';
import path from 'path';

import {OpenAiService} from '../OpenAiService';
import {ConfigurationManager} from '../../configurationManager/ConfigurationManager';

describe('OpenAiService', () => {
  let openaiInstance: OpenAiService;
  beforeAll(async () => {
    // Load config.example.yml into ConfigurationManager
    const yamlString = fs.readFileSync(
      path.resolve(__dirname, '../../../config.yml'),
      'utf8',
    );
    await ConfigurationManager.loadConfig(yamlString);
  });
  beforeEach(() => {
    openaiInstance = OpenAiService.getInstance(ConfigurationManager);
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
