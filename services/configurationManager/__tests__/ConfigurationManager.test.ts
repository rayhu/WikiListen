import {ConfigurationManager} from '../ConfigurationManager'; // Adjust the path accordingly
// import yaml from 'js-yaml';
// import _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

// Mock the fs.promises.readdir function
jest.mock('fs', () => {
  const originalFs = jest.requireActual('fs');
  return {
    ...originalFs,
    promises: {
      ...originalFs.promises,
      readdir: jest.fn(),
    },
  };
});

describe('ConfigurationManager', () => {
  afterEach(() => {
    // Reset the isLoaded flag after each test
    (ConfigurationManager as any).isLoaded = false;
    (ConfigurationManager as any).configData = null;
  });

  describe('loadConfig', () => {
    it('should load configuration from provided YAML string', async () => {
      const yamlString = 'someKey: someValue';
      await ConfigurationManager.loadConfig(yamlString);

      const result = ConfigurationManager.getConfig('someKey');
      expect(result).toBe('someValue');
    });

    it('should not reload configuration if already loaded', async () => {
      const yamlString = 'someKey: someValue';
      await ConfigurationManager.loadConfig(yamlString);

      const secondYamlString = 'someKey: newValue';
      await ConfigurationManager.loadConfig(secondYamlString);

      const result = ConfigurationManager.getConfig('someKey');
      expect(result).toBe('someValue'); // Should still be the original value
    });

    it('should set OpenAI API key from environment variable if available', async () => {
      process.env.OPENAI_API_KEY = 'testApiKey';
      const yamlString = 'someKey: someValue';
      await ConfigurationManager.loadConfig(yamlString);

      const result = ConfigurationManager.getConfig('openAi.apiKey');
      expect(result).toBe('testApiKey');
    });
  });

  describe('getConfig', () => {
    it('should return the default value if config is not loaded', () => {
      const result = ConfigurationManager.getConfig('someKey', 'defaultValue');
      expect(result).toBe('defaultValue');
    });

    it('should return the value from loaded config if key exists', async () => {
      const yamlString = 'nested: { key: value }';
      await ConfigurationManager.loadConfig(yamlString);

      const result = ConfigurationManager.getConfig('nested.key');
      expect(result).toBe('value');
    });

    it('should return the default value if key does not exist in loaded config', async () => {
      const yamlString = 'nested: { key: value }';
      await ConfigurationManager.loadConfig(yamlString);

      const result = ConfigurationManager.getConfig(
        'nonexistent.key',
        'defaultValue',
      );
      expect(result).toBe('defaultValue');
    });
  });

  describe('findConfigFileRecursively', () => {
    it('should find the config file in the specified folder', async () => {
      const mockFolder = '/mock/folder';
      const mockFile = 'config.yml';

      (
        fs.promises.readdir as jest.MockedFunction<typeof fs.promises.readdir>
      ).mockResolvedValueOnce([{isFile: () => true, name: mockFile} as any]);

      const result = await ConfigurationManager.findConfigFileRecursively(
        mockFolder,
      );
      expect(result).toBe(mockFolder);
    });

    it('should return an empty string if the config file is not found within 5 levels', async () => {
      const mockFolder = '/mock/folder';
      const mockFile = 'config.yml';

      (fs.promises.readdir as jest.Mock).mockResolvedValue([
        {isFile: () => false, name: 'not-the-config-file'} as any,
      ]);

      const result = await ConfigurationManager.findConfigFileRecursively(
        mockFolder,
        mockFile,
      );
      expect(result).toBe('');
    });
  });
});
