import Printer from '../src/lib/utils';

describe('A Printer instance', () => {
  const test = 'Wadus';
  const printer = new Printer();
  const consoleSpy = jest.spyOn(console, 'log');

  it('should be able to log a header', async () => {
    printer.header(test);
    expect(consoleSpy).toHaveBeenCalledWith(
      '-----------------------------------------------------------------------'
    );
    expect(consoleSpy).toHaveBeenCalledWith('Wadus');
    expect(consoleSpy).toHaveBeenCalledWith(
      '-----------------------------------------------------------------------'
    );
  });
  it('should be able to log a subheader', async () => {
    printer.subHeader(test);
    expect(consoleSpy).toHaveBeenCalledWith(
      '-----------------------------------------------------------------------'
    );
    expect(consoleSpy).toHaveBeenCalledWith('Wadus');
  });
  it('should be able to log a download', async () => {
    printer.download(test);
    expect(consoleSpy).toHaveBeenCalledWith('  └ ⬇️  Wadus');
  });
  it('should be able to log a capture', async () => {
    printer.capture(test);
    expect(consoleSpy).toHaveBeenCalledWith('  └ 🏙  Wadus');
  });
  it('should be able to log a resize task', async () => {
    printer.resize(test);
    expect(consoleSpy).toHaveBeenCalledWith('  └ 🌉  Wadus');
  });
  it('should be able to log a compare task', async () => {
    printer.compare(test);
    expect(consoleSpy).toHaveBeenCalledWith('  └ 🌉  Wadus');
  });
  it('should be able to log', async () => {
    printer.log(test);
    expect(consoleSpy).toHaveBeenCalledWith('Wadus');
  });
});
