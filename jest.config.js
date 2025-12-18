module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/src/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/environments/**',
    '!src/test.ts',
  ],
  coverageReporters: ['html', 'text-summary', 'lcov'],
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|ts)',
    '<rootDir>/src/**/(*.)+(spec|test).(js|ts)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  cacheDirectory: '<rootDir>/.jest-cache',
};