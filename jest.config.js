module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-fs|@react-native|@react-native/js-polyfills)/)',
  ],
};
