# Wiki Listen

Wiki Listen is an application designed to audibly read Wikipedia articles. While mobile devices offer built-in screen reading capabilities, they often read aloud citations and info-boxes, which can be distracting. Wiki Listen retrieves Wikipedia pages and provides a more streamlined auditory experience.

Combined with ChatGPT APIs, it finds nearby locations, pick content for you to listen and create an abstract for every story.

User can also interact with the AI bot to pickup favorite content to listen to.

This project is based on the [**React Native**](https://reactnative.dev), using the cli tool [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Developer Getting Started

![Pull Request](https://github.com/rayhu/WikiListen/actions/workflows/check_pr.yml/badge.svg)
![Android Build](https://github.com/rayhu/WikiListen/actions/workflows/android_build.yml/badge.svg?event=push)
![iOS Build](https://github.com/rayhu/WikiListen/actions/workflows/ios_build.yml/badge.svg?event=push)

>**Note**: Make sure you install the necessary software into your computer according to [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

You need an openAi API token to talk to chatgpt.
After you register with openAi and obtained your token,
save it to the .env file in the root of the repo.
This repo uses dotenv package to load environment variables from the ".env" file.

Sample content of .env.

```bash
OPENAI_API_KEY=sk-.....
```

It loads the value to process.env.OPENAI_API_KEY, this key is then loaded into the ConfigurationManager class.

You can also copy the config.example.yml to config.yml and add apiKey to it.
When both are present, the dotenv file has higher priority.

Don't commit your apiKey. Both the config.yml and the .env file is ignored by git.

You can run the chatWithGpt.ts directly after provided your apiKey.

```
npm install -g ts-node typescript
ts-node /.scripts/chatWithGpt.ts
```

```
ts-node .\scripts\chatWithGpt.ts
Loaded OpenAI api key from env variable
Please enter the content prompt: Hello, are you chatgpt? What version are you?
[
  {
    index: 0,
    message: {
      role: 'assistant',
      content: 'Hello! Yes, I am GPT-3, the third version of the Generative Pre-trained Transformer (GPT) developed by OpenAI. How can I assist you today?'
    },
    finish_reason: 'stop'
  }
]
Please enter the content prompt:
```

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

### Step 3: Modifying App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

The GitHub Actions workflow has been setup to run lint, type check and unit test for every pull request.

## Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## TODO list

* SearchBar in React-Native-Elements

The react-native-elements's latest stable version (3.4.3) has the SearchBar type broken.
The default props are not respected.
Upgraded to 4.0.0-rc.2 which solved this issue. 
Please upgrade to right version when it has an official release.

<https://www.npmjs.com/package/react-native-elements?activeTab=versions>

* React-Native-TTS doesn't have handle events well.

The design is to speak a full sentence, once it is done (received tts.finished event), the tts will speak the next sentence.
If user requests stop, it will remove the event handler, so that the app will not be cut off.

The latest version of react-native-tts (4.1.0 released on Mar 25, 2021) has no stub function for addListener/removeListeners.

It is required for RN built in Event Emitter Calls. So a github commit (Nov 8, 2022) is used.
<https://github.com/ak1394/react-native-tts/commit/8f302a857ac5a9158e92b8e65313a3af09b89b76>

Use the official version when it is released.

### Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
