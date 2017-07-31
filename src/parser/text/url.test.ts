import { sanitize } from './url';

describe('Unit: parser/url', () => {
  describe('sanitiza', () => {
    it('empty', () => {
      assert(sanitize('') === '');
    });

    it('invalid', () => {
      assert(sanitize(' a\n b\n') === 'a%0A%20b');
    });

    it('protocol', () => {
      assert(sanitize('javascript:') === '');
      assert(sanitize('javascript:alert)') === '');
      assert(sanitize('vbscript:alert)') === '');
      assert(sanitize('data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)') === '');
      assert(sanitize('any:alert)') === '');
    });

  });

});
