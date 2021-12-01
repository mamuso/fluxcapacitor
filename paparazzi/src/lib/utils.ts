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

export const slugify = (text: string, separator = '-'): string => {
  text = text.toString().toLowerCase().trim();

  const sets = [
    { to: 'a', from: '[ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
    { to: 'ae', from: '[Ä]' },
    { to: 'c', from: '[ÇĆĈČ]' },
    { to: 'd', from: '[ÐĎĐÞ]' },
    { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
    { to: 'g', from: '[ĜĞĢǴ]' },
    { to: 'h', from: '[ĤḦ]' },
    { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
    { to: 'j', from: '[Ĵ]' },
    { to: 'ij', from: '[Ĳ]' },
    { to: 'k', from: '[Ķ]' },
    { to: 'l', from: '[ĹĻĽŁ]' },
    { to: 'm', from: '[Ḿ]' },
    { to: 'n', from: '[ÑŃŅŇ]' },
    { to: 'o', from: '[ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
    { to: 'oe', from: '[ŒÖ]' },
    { to: 'p', from: '[ṕ]' },
    { to: 'r', from: '[ŔŖŘ]' },
    { to: 's', from: '[ŚŜŞŠ]' },
    { to: 'ss', from: '[ß]' },
    { to: 't', from: '[ŢŤ]' },
    { to: 'u', from: '[ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
    { to: 'ue', from: '[Ü]' },
    { to: 'w', from: '[ẂŴẀẄ]' },
    { to: 'x', from: '[ẍ]' },
    { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
    { to: 'z', from: '[ŹŻŽ]' },
    { to: '-', from: "[·/_,:;']" },
  ];

  for (const set of sets) {
    text = text.replace(new RegExp(set.from, 'gi'), set.to);
  }

  text = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  if (typeof separator !== 'undefined' && separator !== '-') {
    text = text.replace(/-/g, separator);
  }

  return text;
};
