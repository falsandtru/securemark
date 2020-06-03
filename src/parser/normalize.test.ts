import { normalize } from './normalize';

describe('Unit: parser/normalize', () => {
  describe('normalize', () => {
    it('insecure characters', () => {
      assert(normalize('\u0000\u0000') === '\uFFFD\uFFFD');
    });

    it('surrogate pairs', () => {
      assert(normalize('\uDC00\uD800') === '\uFFFD\uFFFD');
    });

    it('control', () => {
      assert(normalize('\v') === '\n');
      assert(normalize('\f') === '\n');
      assert(normalize('\r') === '\n');
      assert(normalize('\r\n') === '\n');
      assert(normalize('\n\r') === '\n\n');
      assert(normalize('\x00') === '\uFFFD');
      assert(normalize('\x01') === '');
      assert(normalize('\x02') === '');
      assert(normalize('\x03') === '');
      assert(normalize('\x04') === '');
      assert(normalize('\x05') === '');
      assert(normalize('\x06') === '');
      assert(normalize('\x07') === '');
      assert(normalize('\x08') === '');
      assert(normalize('\x09') === '\t');
      assert(normalize('\x0A') === '\n');
      assert(normalize('\x0B') === '\n');
      assert(normalize('\x0C') === '\n');
      assert(normalize('\x0D') === '\n');
      assert(normalize('\x0E') === '');
      assert(normalize('\x0F') === '');
      assert(normalize('\x10') === '');
      assert(normalize('\x11') === '');
      assert(normalize('\x12') === '');
      assert(normalize('\x13') === '');
      assert(normalize('\x14') === '');
      assert(normalize('\x15') === '');
      assert(normalize('\x16') === '');
      assert(normalize('\x17') === '');
      assert(normalize('\x18') === '');
      assert(normalize('\x19') === '');
      assert(normalize('\x1A') === '');
      assert(normalize('\x1B') === '');
      assert(normalize('\x1C') === '');
      assert(normalize('\x1D') === '');
      assert(normalize('\x1E') === '');
      assert(normalize('\x1F') === '');
      assert(normalize('\x7F') === '');
    });

    it('sanitization', () => {
      assert.deepStrictEqual(normalize('\r\n'.repeat(100) + '.'), '\n'.repeat(100) + '.');
    });

  });

});
