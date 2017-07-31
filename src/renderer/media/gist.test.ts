import { gist } from './gist';
import DOM from 'typed-dom';

describe('Unit: renderer/media/gist', () => {
  describe('gist', () => {
    it('result', () => {
      assert(!gist(DOM.img({ 'data-src': 'http://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557' }, '').element));
      assert(gist(DOM.img({ 'data-src': 'https://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557' }, '').element));
    });

  });

});
