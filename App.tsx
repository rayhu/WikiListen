// App.tsx

import React from 'react';
import Speaker from './services/speaker/Speaker';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from './pages/SearchScreen';
import PlayingScreen from './pages/PlayingScreen';
import {enableScreens} from 'react-native-screens';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import fs from 'fs';
import path from 'path';

import {OpenAiService} from './services/openAi/OpenAiService';
import {ConfigurationManager} from './services/configurationManager/ConfigurationManager';

const platformSpecificVoice = Platform.select({
  ios: 'com.apple.voice.compact.en-US.Samantha',
  android: 'en-us-x-tpf-local',
});

enableScreens();
const Stack = createStackNavigator();

const App: React.FC = () => {
  React.useEffect(() => {
    if (SplashScreen) {
      SplashScreen.hide();
    }
    const speaker = new Speaker(); //('Hello, Wiki Listen!');
    speaker.setVoice(platformSpecificVoice);

    /**
     * return config file path in debug mode.
     * @returns
     */
    const getConfigPathInDebugMode = async (): Promise<string | null> => {
      const confgFileRelativePath =
        await ConfigurationManager.findConfigFileRecursively(
          __dirname,
          'config.yml',
        );
      if (!confgFileRelativePath) {
        return null;
      }
      return path.resolve(confgFileRelativePath, './config.yml');
    };

    /**
     * Read config file and return the config string
     * @param isDebugMode
     * @returns
     */
    const getConfigString = async (isDebugMode: boolean): Promise<string> => {
      if (isDebugMode) {
        const configPath = await getConfigPathInDebugMode();
        if (!configPath) {
          throw new Error('config.yml not found in the project.');
        }
        return fs.readFileSync(configPath, 'utf8');
      } else {
        const configPath = `${RNFS.MainBundlePath}/config.yml`;
        return await RNFS.readFile(configPath, 'utf8');
      }
    };

    const fetchData = async () => {
      const isDebugMode = __DEV__; // __DEV__ is true in debug mode, false in release mode
      // In debug mode, the file is serve by Metro bundler in a different path than release, make sure metro bundler can serve yml.
      const configString = await getConfigString(isDebugMode);

      await ConfigurationManager.loadConfig(configString);

      const model = ConfigurationManager.getConfig(
        'openAi.chatGpt.defaultModel',
        'davinci',
      );

      const openAiInstance = OpenAiService.getInstance(ConfigurationManager);

      let content = 'Say chatGpt welcomes you.';
      let result = await openAiInstance.getCompletion(content, model);
      console.log(
        `received completion result: ${JSON.stringify(result, null, 2)}`,
      );
      result.choices.forEach(choice => {
        if (choice.message.content) {
          console.log(choice);
          speaker.speak(choice.message.content);
        }
      });
    };

    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Playing">
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Playing" component={PlayingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
