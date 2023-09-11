import yaml from 'js-yaml';
import RNFS from 'react-native-fs';
import _ from 'lodash';

export class ConfigurationManager {
  private static configData: any;

  private constructor() {} // Ensure this class cannot be instantiated
  private static isLoaded: boolean = false;
  public static async loadConfig(): Promise<void> {
    try {
      if (ConfigurationManager.isLoaded) {
        return;
      }
      const isDebugMode = __DEV__; // __DEV__ is true in debug mode, false in release mode
      // In debug mode, the file is serve by Metro bundler in a different path than release, make sure metro bundler can serve yml.
      const configPath = isDebugMode
        ? './.cred/config.yml'
        : `${RNFS.MainBundlePath}/.cred/config.yml`;
      const configFile = await RNFS.readFile(configPath, 'utf8');
      ConfigurationManager.configData = yaml.load(configFile);
      ConfigurationManager.isLoaded = true;
      let openAiApiKey: string | undefined = process.env.OPENAI_API_KEY;
      if (openAiApiKey) {
        console.log('Loaded OpenAI api key from env variable');
        _.set(ConfigurationManager.configData, 'openAi.apiKey', openAiApiKey);
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
      return defaultValue !== undefined ? defaultValue : null;
    }

    const value = _.get(this.configData, keyHierarchy);

    if (value !== undefined) {
      return value;
    } else {
      return defaultValue;
    }
  }
}
