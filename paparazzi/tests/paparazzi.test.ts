import Paparazzi from '../src/paparazzi';
import * as fs from 'fs';

jest.mock(
  '../../config.json',
  () => ({
    format: 'png',
    compare: true,

    devices: [
      {
        id: 'desktop',
        viewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 2,
        },
      },
      { id: 'mobile', device: 'iPhone X' },
    ],

    endpoints: [
      {
        id: 'nextjs',
        url: 'https://nextjs.org',
      },
      {
        id: 'gatsby',
        url: 'https://www.gatsbyjs.com',
      },
      {
        id: 'hugo',
        url: 'https://gohugo.io',
      },
      {
        id: 'nuxt',
        url: 'https://nuxtjs.org',
      },
    ],
  }),
  { virtual: true }
);

describe('A paparazzi instance', () => {
  const date = '2021-04-13';
  const paparazzi = new Paparazzi(date);
  it('should create a config object', async () => {
    expect(paparazzi.config.date).toBe('2021-04-13');
    expect(paparazzi.config.tmpPath).toBe('tmp');
    expect(paparazzi.config.tmpDatePath).toBe('tmp/2021-04-13');
    expect(paparazzi.config.tmpCurrentPath).toBe('tmp/current');
  });
  describe('when calling paparazzi.setup', () => {
    it('should create a scaffold with folders', async () => {
      await paparazzi.setup();
      expect(await fs.promises.stat(paparazzi.config.tmpPath)).toBeTruthy();
      expect(await fs.promises.stat(paparazzi.config.tmpDatePath)).toBeTruthy();
      expect(
        await fs.promises.stat(paparazzi.config.tmpCurrentPath)
      ).toBeTruthy();
    });
  });
  describe('when calling paparazzi.capture', () => {
    it('should create log a subheader', async () => {
      const spy = jest.spyOn(console, 'log');
      await paparazzi.capture();
      expect(spy).toHaveBeenCalledWith('🤓 Creating a new caputre session');
    });
  });
  describe('when calling paparazzi.cleanup', () => {
    it('should clean the tmp folders', async () => {
      await paparazzi.cleanup();
      expect(fs.existsSync(paparazzi.config.tmpPath)).toBeFalsy();
    });
  });
});
