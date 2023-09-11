import React from 'react';
import Speaker from './services/Speaker';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SearchScreen from './pages/SearchScreen';
import PlayingScreen from './pages/PlayingScreen';
import {enableScreens} from 'react-native-screens';
import {Platform} from 'react-native';
import OpenAI from 'openai';

import {OpenAIService} from './services/openAi/OpenAIService';
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

    const fetchData = async () => {
      await ConfigurationManager.loadConfig();

      const model = ConfigurationManager.getConfig(
        'openAi.chatGpt.defaultModel',
        'davinci',
      );

      const openAIService = OpenAIService.getInstance();

      let content = 'Say chatGpt welcomes you.';
      let result: OpenAI.Chat.ChatCompletion =
        await openAIService.getCompletion(content, model);
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
