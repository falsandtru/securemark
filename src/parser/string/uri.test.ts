import { sanitize, decode } from './uri';

describe('Unit: parser/text/uri', () => {
  describe('sanitiza', () => {
    it('empty', () => {
      assert(sanitize('') === '');
    });

    it('invalid', () => {
      assert(sanitize('a\n b') === 'a%0A%20b');
    });

    it('protocol', () => {
      assert(sanitize('http:') === 'http:');
      assert(sanitize('https://example') === 'https://example');
      assert(sanitize('tel:') === undefined);
      assert(sanitize('javascript:') === undefined);
      assert(sanitize('javascript:alert)') === undefined);
      assert(sanitize('vbscript:alert)') === undefined);
      assert(sanitize('data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)') === undefined);
      assert(sanitize('any:alert)') === undefined);
      assert(sanitize('tel:', ['tel:']) === 'tel:');
      assert(sanitize('http:', ['tel:']) === 'http:');
    });

  });

  describe('decode', () => {
    it('invalid', () => {
      assert(decode('%FF') === '%FF');
    });

    it('valid', () => {
      assert(decode(' %20') === '%20%20');
    });

  });

});
