import Tts from 'react-native-tts';

class Speaker {
  private isSpeaking: boolean;
  private sentence: string;

  constructor(sentence: string | undefined) {
    this.sentence = '';
    this.isSpeaking = false;
    // console.log('supported voices list:');
    // Tts.voices().then(voices => console.log(JSON.stringify(voices, '', 2)));
    Tts.setDefaultLanguage('en-US');
    if (sentence) {
      this.sentence = sentence;
      Tts.getInitStatus().then(() => {
        this.speak(sentence);
      });
    }
  }

  async getVoices() {
    return await Tts.voices();
  }

  setVoice(voice?: string) {
    if (!voice) {
      return;
    }
    console.log(`setting voice to: ${voice}`);
    try {
      Tts.setDefaultVoice(voice);
    } catch (error) {
      console.warn(`failed setting voice to: ${voice}`);
    }
    return;
  }

  speak(sentence: string) {
    if (sentence) {
      this.isSpeaking = true;
      this.sentence = sentence;
      Tts.addEventListener('tts-finish', this.onSpeechFinish);
      Tts.speak(sentence);
      this.isSpeaking = false;
    }
  }

  stop() {
    if (this.isSpeaking) {
      Tts.removeEventListener('tts-finish', this.onSpeechFinish);
      Tts.stop();
      this.isSpeaking = false;
    }
  }

  onSpeechFinish(event: any) {
    // Handle the event here
    console.log('Speech finished', event);
  }
}

export default Speaker;
