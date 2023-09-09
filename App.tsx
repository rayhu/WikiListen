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
import getOpenAi from './services/chatGpt/openAiApi';

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
      // asynchronous code here, e.g., fetch data from an API
      const openai = await getOpenAi();
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{role: 'user', content: 'Say chatGpt welcomes you.'}],
        model: 'gpt-3.5-turbo',
      };
      const completion: OpenAI.Chat.ChatCompletion =
        await openai.chat.completions.create(params);
      console.log(
        `received completion result: ${JSON.stringify(completion, null, 2)}`,
      );
      completion.choices.forEach(choice => {
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
