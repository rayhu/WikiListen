require('dotenv').config();

import fs from 'fs';
import path from 'path';

import * as readline from 'readline';
import {OpenAIService} from '../services/openAi/OpenAiService';
import {promptUser} from './promptUser';
import {ConfigurationManager} from '../services/configurationManager/ConfigurationManager';

const DAILY_QUOTA = 1000;

export async function mainLoop() {
  const yamlString = fs.readFileSync(
    path.resolve(__dirname, '../../../config.example.yml'),
    'utf8',
  );
  await ConfigurationManager.loadConfig(yamlString);

  const service = OpenAIService.getInstance(ConfigurationManager);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let requestsToday = 0;
  let lastRequestDate = new Date().toDateString();

  while (true) {
    const currentDate = new Date().toDateString();
    if (currentDate !== lastRequestDate) {
      requestsToday = 0;
      lastRequestDate = currentDate;
    }

    if (requestsToday >= DAILY_QUOTA) {
      throw new Error('Daily quota exceeded');
    }

    const content = await promptUser(rl);
    if (!content) {
      console.log('Exiting...');
      break;
    }

    const completion = await service.getCompletion(content);
    requestsToday++;
    console.log(completion.choices);
  }

  rl.close();
}

(async () => {
  try {
    await mainLoop();
  } catch (error) {
    console.error('Error in the script:', error);
  }
})();
