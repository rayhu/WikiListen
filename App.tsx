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

const platformSpecificVoice = Platform.select({
  ios: 'com.apple.voice.compact.en-US.Samantha',
  android: 'en-us-x-tpf-local',
});

enableScreens();
const Stack = createStackNavigator();

const App: React.FC = () => {
  const speaker = new Speaker('Hello, Wiki Listen!');
  speaker.setVoice(platformSpecificVoice);

  React.useEffect(() => {
    if (SplashScreen) {
      SplashScreen.hide();
    }
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
