import yaml from 'js-yaml';
import _ from 'lodash';

export class ConfigurationManager {
  private constructor() {} // Ensure this class cannot be instantiated

  private static configData: any;

  private static isLoaded: boolean = false;

  public static async loadConfig(yamlString: string): Promise<void> {
    if (this.isLoaded) {
      return;
    }
    try {
      this.configData = yaml.load(yamlString);
      this.isLoaded = true;

      const openAiApiKey = process.env.OPENAI_API_KEY;
      if (openAiApiKey) {
        console.log('Loaded OpenAI api key from env variable');
        _.set(this.configData, 'openAi.apiKey', openAiApiKey);
      }
    } catch (error) {
      console.error('Failed to load config.yml:' + error);
    }
  }

  /**
   * Get the config value by key hierarchy
   * @param keyHierarchy The object key hierarchy in the format of object1.key2.subKey3
   * @param defaultValue The default value to return if the key is not found
   * @returns
   */
  public static getConfig(keyHierarchy: string, defaultValue?: any): any {
    if (!this.configData) {
      console.warn("Config not loaded. Call 'loadConfig' first.");
      return defaultValue ?? null;
    }

    return _.get(this.configData, keyHierarchy, defaultValue);
  }
}
