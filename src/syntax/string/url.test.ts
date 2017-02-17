import { sanitize } from './url';

describe('Unit: syntax/url', () => {
  describe('sanitiza', () => {
    it('empty', () => {
      assert(sanitize('') === '');
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
