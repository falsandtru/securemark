import { gist } from './gist';

describe('Unit: renderer/render/media/gist', () => {
  describe('gist', () => {
    it('result', () => {
      assert(!gist('http://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557'));
      assert(gist('https://gist.github.com/falsandtru/cdf4a19b70012b0d6e3c9e1ec021e557'));
    });

  });

});
