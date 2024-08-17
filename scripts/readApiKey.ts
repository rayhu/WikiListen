import * as fs from 'fs';
import path from 'path';

export async function getApiKey(file?: string, key?: string): Promise<string> {
  try {
    if (process.env.OPENAI_API_KEY) {
      console.log('Using openAi apiKey from env var');
      return process.env.OPENAI_API_KEY;
    }

    file = file || '../.cred/token.json';
    key = key || 'chatGptApiKey';
    const absoluteFilePath: string = path.join(__dirname, file);
    const data = await fs.promises.readFile(absoluteFilePath, 'utf8');
    const json = JSON.parse(data);
    console.log(`using the openAi apiKey from config file: ${file}`);
    return json[key] || '';
  } catch (error) {
    console.log(`Failed to get openAi apiKey. ${error}`);
    return '';
  }
}
