/* eslint-disable no-console */

/**
 * Silly utilities, mostly for logging.
 */

export class Printer {
  header = (text: string): void => {
    console.log('');
    console.log(
      '-----------------------------------------------------------------------'
    );
    console.log(`${text}`);
    console.log(
      '-----------------------------------------------------------------------'
    );
  };

  subHeader = (text: string): void => {
    console.log('');
    console.log(`${text}`);
    console.log(
      '-----------------------------------------------------------------------'
    );
  };

  download = (text: string): void => {
    console.log(`  └ ⬇️  ${text}`);
  };

  capture = (text: string): void => {
    console.log(`  └ 🏙  ${text}`);
  };

  resize = (text: string): void => {
    console.log(`  └ 🌉  ${text}`);
  };

  compare = (text: string): void => {
    console.log(`  └ 🎆  ${text}`);
  };

  log = (text: string): void => {
    console.log(`${text}`);
  };
}
