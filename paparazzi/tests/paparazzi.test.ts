import { Paparazzi } from '../src/paparazzi';
import * as fs from 'fs';

const date = '2021-04-13';

// mocking configuration file
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
      { id: 'mobile', device: 'iPhone 11 Pro Max' },
    ],
    endpoints: [
      {
        id: '12factor',
        url: 'https://12factor.net',
      },
      {
        id: 'adams-heroku-values.md',
        url: 'https://gist.github.com/adamwiggins/5687294',
      },
      {
        id: 'Pure UI',
        url: 'https://rauchg.com/2015/pure-ui',
      },
    ],
  }),
  { virtual: true }
);

describe('A paparazzi instance', () => {
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
      // Check all the log messages
      // Headings
      expect(spy).toHaveBeenCalledWith('🤓 Creating a new caputre session');
      expect(spy).toHaveBeenCalledWith('📷 Capture URLs');

      // Devices
      expect(spy).toHaveBeenCalledWith('🖥  desktop (1920x1080)');
      expect(spy).toHaveBeenCalledWith('🖥  mobile (414x896)');

      // Endpoints
      expect(spy).toHaveBeenCalledWith(
        '  └ 🏙  12factor – 12factor.png – desktop'
      );
      expect(spy).toHaveBeenCalledWith(
        '  └ 🏙  12factor – 12factor.png – mobile'
      );
      expect(spy).toHaveBeenCalledWith(
        '  └ 🏙  adams-heroku-values.md – adams-heroku-valuesmd.png – desktop'
      );
      expect(spy).toHaveBeenCalledWith(
        '  └ 🏙  adams-heroku-values.md – adams-heroku-valuesmd.png – mobile'
      );
      expect(spy).toHaveBeenCalledWith(
        '  └ 🏙  Pure UI – pure-ui.png – desktop'
      );
      expect(spy).toHaveBeenCalledWith('  └ 🏙  Pure UI – pure-ui.png – mobile');

      // We expect folders to be created for each device
      expect(
        await fs.promises.stat(`${paparazzi.config.tmpDatePath}/desktop`)
      ).toBeTruthy();
      expect(
        await fs.promises.stat(`${paparazzi.config.tmpDatePath}/mobile`)
      ).toBeTruthy();
    });
  });
  describe('when calling paparazzi.cleanup', () => {
    it('should clean the tmp folders', async () => {
      await paparazzi.cleanup();
      expect(fs.existsSync(paparazzi.config.tmpPath)).toBeFalsy();
    });
  });
});
