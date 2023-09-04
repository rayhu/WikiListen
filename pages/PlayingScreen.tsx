import React from 'react';
import {WebView} from 'react-native-webview';
import Speaker from '../services/Speaker';
import {StyleSheet, View, Button, Text} from 'react-native';

const PlayingScreen = ({route, navigation}) => {
  // const {articleId} = route.params;
  let parent = navigation.getParent();
  if (!parent) {
    parent = 'Root';
  }
  console.log(`Parent ${parent}, current location: ${route.name}`);
  const [url, setUrl] = React.useState(
    'https://en.wikipedia.org/wiki/Main_Page',
  );

  const [playing, setPlaying] = React.useState(false);

  let textOnCurrentPage: any[] = [];
  const runJSInBackground = `
  var targetDiv = document.querySelector('.mw-parser-output');
  if (targetDiv) {
    var clonedElement = targetDiv.cloneNode(true);
    var supElements = clonedElement.querySelectorAll('sup, script, style, .mw-editsection, img, .geo-default, #References');
    supElements.forEach(function(sup) {
      sup.innerHTML = '';
    });
    var infoboxDiv = clonedElement.querySelector('table.infobox');
    if (infoboxDiv) {
      infoboxDiv.innerHTML = '';
      window.ReactNativeWebView.postMessage("infobox table removed.");
    }
    var textWithLineBreaks = clonedElement.textContent.replace(/\\n/g, '|n|');
    window.ReactNativeWebView.postMessage(textWithLineBreaks);
  }
  `;

  const speaker = new Speaker();

  const onMessage = event => {
    const textWithLineBreaks = event.nativeEvent.data.replace(/\|n\|/g, '\n');
    textOnCurrentPage = textWithLineBreaks.split('. ');
    if (!playing) {
      return; // if not playing, return
    }
    textOnCurrentPage.forEach((sentence: string) => {
      speaker.speak(sentence);
    });
  };

  const loadNewPage = () => {
    speaker.stop();
    textOnCurrentPage = [];
    setUrl('https://en.wikipedia.org/wiki/Communications_Hill,_San_Jose');
  };

  const startPlaying = () => {
    stopPlaying();
    setPlaying(true);
    textOnCurrentPage.forEach((sentence: string) => {
      console.log(`Speaking: ${sentence}`);

      speaker.speak(sentence);
    });
  };

  const stopPlaying = () => {
    console.log('stopping playing');
    speaker.stop();
  };
  // const userAgent =
  //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537';

  return (
    <View style={styles.container}>
      <Text>Now playing</Text>
      {/* Your playing UI here with article {articleId} */}

      <WebView
        source={{uri: url}}
        injectedJavaScript={runJSInBackground}
        onMessage={onMessage}
        // userAgent={userAgent}
        style={styles.webview}
      />
      {/* <Button title="Go back" onPress={() => navigation.goBack()} /> */}
      <Button title="Start Playing" onPress={startPlaying} />
      {/* <Button title="Pause Playing" onPress={pausePlaying} /> */}
      <Button title="Go comms hill" onPress={loadNewPage} />
    </View>
  );
};

export default PlayingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    marginTop: 10,
    marginBottom: 40,
    width: '90%', // Adjust width as needed
    height: '80%', // Adjust height as needed
  },
});
