import { image } from './image';

describe('Unit: renderer/render/media/image', () => {
  describe('image', () => {
    it('result', () => {
      assert(image('/', '') instanceof HTMLImageElement);
      assert(image('/', '').getAttribute('src') === '/');
      assert(image('/', '').getAttribute('alt') === '');
    });

  });

});
