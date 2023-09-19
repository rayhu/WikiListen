module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
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
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 90,
      lines: 80,
    },
  },
};
