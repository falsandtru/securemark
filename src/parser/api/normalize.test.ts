import { normalize, escape } from './normalize';

describe('Unit: parser/normalize', () => {
  describe('normalize', () => {
    it('invalid surrogate pairs', () => {
      assert(normalize('\uDC00\uD800') === '\uFFFD\uFFFD');
    });

    it('controls', () => {
      assert(normalize('\r') === '\n');
      assert(normalize('\r\n') === '\n');
      assert(normalize('\n\r') === '\n\n');
      assert(normalize('\x00') === '\uFFFD');
      assert(normalize('\x01') === '\uFFFD');
      assert(normalize('\x02') === '\uFFFD');
      assert(normalize('\x03') === '\uFFFD');
      assert(normalize('\x04') === '\uFFFD');
      assert(normalize('\x05') === '\uFFFD');
      assert(normalize('\x06') === '\uFFFD');
      assert(normalize('\x07') === '\uFFFD');
      assert(normalize('\x08') === '\uFFFD');
      assert(normalize('\x09') === '\t');
      assert(normalize('\x0A') === '\n');
      assert(normalize('\x0B') === '\uFFFD');
      assert(normalize('\x0C') === '\uFFFD');
      assert(normalize('\x0D') === '\n');
      assert(normalize('\x0E') === '\uFFFD');
      assert(normalize('\x0F') === '\uFFFD');
      assert(normalize('\x10') === '\uFFFD');
      assert(normalize('\x11') === '\uFFFD');
      assert(normalize('\x12') === '\uFFFD');
      assert(normalize('\x13') === '\uFFFD');
      assert(normalize('\x14') === '\uFFFD');
      assert(normalize('\x15') === '\uFFFD');
      assert(normalize('\x16') === '\uFFFD');
      assert(normalize('\x17') === '\uFFFD');
      assert(normalize('\x18') === '\uFFFD');
      assert(normalize('\x19') === '\uFFFD');
      assert(normalize('\x1A') === '\uFFFD');
      assert(normalize('\x1B') === '\uFFFD');
      assert(normalize('\x1C') === '\uFFFD');
      assert(normalize('\x1D') === '\uFFFD');
      assert(normalize('\x1E') === '\uFFFD');
      assert(normalize('\x1F') === '\uFFFD');
      assert(normalize('\x7F') === '\uFFFD');
    });

    it('sanitize', () => {
      assert(normalize('\u2006') === '\uFFFD');
      assert(normalize('\u202A') === '\uFFFD');
      assert(normalize('\u202F') === '\uFFFD');
      assert(normalize('\uFEFF') === '\uFFFD');
      assert(normalize('\u180E') === '\uFFFD');
      assert(normalize('\u1820\u180E') === '\u1820\u180E');
      assert(normalize('\u1821\u180E') === '\u1821\u180E');
      assert(normalize('\u1822\u180E') === '\u1822\uFFFD');
    });

    it('header', () => {
      assert(normalize('---\r\na: b \r\n---\r\n\r\nb\r\n') === '---\na: b \n---\n\nb\n');
      assert(normalize('---\na: b\x01\n---\n\n\x01\n') === '---\na: b\uFFFD\n---\n\n\uFFFD\n');
      assert(normalize('---\na: b\x01\n---\n\x01\n\n') === '---\na: b\uFFFD\n---\n\uFFFD\n\n');
      assert(normalize('---\na: b\x01\n---') === '---\na: b\uFFFD\n---');
      assert(normalize(' ---\na: b\x01\n---') === ' ---\na: b\uFFFD\n---');
      assert(normalize('\0---\na: b\x01\n---') === '\uFFFD---\na: b\uFFFD\n---');
      assert(normalize('\x01---\na: b\x01\n---') === '\uFFFD---\na: b\uFFFD\n---');
      assert(normalize('\x01---\na: b\x01\n---\n\n!> \x01---\na: b\x01\n---') === '\uFFFD---\na: b\uFFFD\n---\n\n!> \uFFFD---\na: b\uFFFD\n---');
    });

  });

  describe('escape', () => {
    it('', () => {
      assert(escape('\u200B') === '&ZeroWidthSpace;');
      assert(escape('\u200D') === '&zwj;');
    });

  });

});
