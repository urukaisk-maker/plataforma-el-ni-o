/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/src/js/__tests__/setup.js'],
  collectCoverageFrom: ['src/js/utils/*.js', 'src/js/services/*.js'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
