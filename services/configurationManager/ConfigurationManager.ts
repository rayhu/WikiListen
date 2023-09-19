import yaml from 'js-yaml';
import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

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
  public static async findConfigFileRecursively(
    startFolder: string,
    fileName: string = 'config.yml',
    maxLevels: number = 5,
  ): Promise<string> {
    if (maxLevels <= 0) {
      return ''; // Reached the maximum level limit without finding the file
    }

    const dirents = await fs.promises.readdir(startFolder, {
      withFileTypes: true,
    });

    // Check if the file exists in the current directory
    for (const dirent of dirents) {
      if (dirent.isFile() && dirent.name === fileName) {
        return startFolder;
      }
    }

    // If not found, move up one directory and search again
    const parentFolder = path.join(startFolder, '..');
    return this.findConfigFileRecursively(
      parentFolder,
      fileName,
      maxLevels - 1,
    );
  }
}
