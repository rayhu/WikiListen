import OpenAI from 'openai';
import * as fs from 'fs';

let apiKey: string | undefined = process.env.OPENAI_API_KEY;

// Reading the apiKey from the .cred/openai.json file
const _getApiKeyFromCred = async (): Promise<string> => {
  if (apiKey) {
    return apiKey;
  }

  const rawData: Buffer = await fs.promises.readFile('.cred/token.json');
  const jsonData: {chatGptApiKey: string} = JSON.parse(rawData.toString());
  apiKey = jsonData.chatGptApiKey;
  return apiKey;
};

const getOpenAi = async (): Promise<OpenAI> => {
  // if the apiKey is in env var, skip reading the file
  if (!apiKey) {
    apiKey = await _getApiKeyFromCred();
  }

  const openai: OpenAI = new OpenAI({
    apiKey: apiKey,
  });

  return openai;
};

export default getOpenAi;
