module.exports = {
  clearMocks: true,
  rootDir: '..',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/test/'],
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
}
