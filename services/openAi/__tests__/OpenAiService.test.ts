require('dotenv').config();

import fs from 'fs';
import path from 'path';

import {OpenAIService} from '../OpenAiService';
import {ConfigurationManager} from '../../configurationManager/ConfigurationManager';

describe('OpenAIService', () => {
  let openaiInstance: OpenAIService;
  beforeAll(async () => {
    // Load config.example.yml into ConfigurationManager
    const yamlString = fs.readFileSync(
      path.resolve(__dirname, '../../../config.example.yml'),
      'utf8',
    );
    await ConfigurationManager.loadConfig(yamlString);
  });
  beforeEach(() => {
    openaiInstance = OpenAIService.getInstance(ConfigurationManager);
  });

  it('should create an instance of OpenAIService', () => {
    expect(openaiInstance).toBeInstanceOf(OpenAIService);
  });

  it('should get completion from OpenAI', async () => {
    const content = 'Hello';
    const result = await openaiInstance.getCompletion(content);
    console.log(JSON.stringify(result, null, 2));
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('object', 'chat.completion');
    expect(result).toHaveProperty('choices');
  }, 30000);
});
