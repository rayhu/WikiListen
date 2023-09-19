import {ConfigurationManager} from '../ConfigurationManager'; // Adjust the path accordingly
import yaml from 'js-yaml';
import _ from 'lodash';

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
});
