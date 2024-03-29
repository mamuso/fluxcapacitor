const tsPreset = require('ts-jest/jest-preset');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = {
  ...tsPreset,
  ...puppeteerPreset,
  testEnvironment: 'node',
  testTimeout: 180000,
  reporters: ['default', 'jest-junit'],
};
