module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-fs|@react-native|@react-native/js-polyfills)/)',
  ],
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    '{services, pages}/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/scripts/**',
  ],
  // coverageThreshold: {
  //   global: {
  //     statements: 50,
  //     branches: 50,
  //     functions: 50,
  //     lines: 50,
  //   },
  // },
};
