import { Printer, slugify } from '../src/lib/utils';

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

describe('Slugify', () => {
  it('should transform strings correctly', async () => {
    expect(slugify('Wadus')).toBe('wadus');
    expect(slugify('Wadus wadus')).toBe('wadus-wadus');
    expect(slugify('Wadus wadus wadus')).toBe('wadus-wadus-wadus');
    expect(
      slugify(
        'La inédita universidad para jugadores de fútbol en España (con Jorge Valdano como invitado estrella). Solo para 25 futbolistas en activo'
      )
    ).toBe(
      'la-inedita-universidad-para-jugadores-de-futbol-en-espana-con-jorge-valdano-como-invitado-estrella-solo-para-25-futbolistas-en-activo'
    );
    expect(
      slugify(
        'Det är de små stunderna och detaljerna som gör julen. Låt hela familjen vara med och pyssla ihop den. Hos oss hittar du allt för det perfekta julstöket.'
      )
    ).toBe(
      'det-aer-de-sma-stunderna-och-detaljerna-som-goer-julen-lat-hela-familjen-vara-med-och-pyssla-ihop-den-hos-oss-hittar-du-allt-foer-det-perfekta-julstoeket'
    );
    expect(
      slugify(
        'Natürlich ist das möglich! Entdecke, wie dieses Geschwisterpaar das wunderbar auf die Reihe bekommt, die gemeinsame Zeit genießt und auch für sich sein kann.'
      )
    ).toBe(
      'natuerlich-ist-das-moeglich-entdecke-wie-dieses-geschwisterpaar-das-wunderbar-auf-die-reihe-bekommt-die-gemeinsame-zeit-geniesst-und-auch-fuer-sich-sein-kann'
    );
  });

  it('should take a custom separator', async () => {
    expect(slugify('Wadus wadus', '*')).toBe('wadus*wadus');
  });
});
