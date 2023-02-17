module.exports = {
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.sass$': 'jest-transform-stub',
    },
    setupFilesAfterEnv: ['./__tests__/setupTests.js'],
    coverageReporters: ['lcov', 'text-summary'],
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    testEnvironment: 'jsdom',
    coverageThreshold: {
      global: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  };