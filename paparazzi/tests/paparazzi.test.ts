import Paparazzi from '../src/paparazzi';
import * as fs from 'fs';

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
  describe('when calling paparazzi.cleanup', () => {
    it('should clean the tmp folders', async () => {
      await paparazzi.cleanup();
      expect(fs.existsSync(paparazzi.config.tmpPath)).toBeFalsy();
    });
  });
});
