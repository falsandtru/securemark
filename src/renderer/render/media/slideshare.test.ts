import { slideshare } from './slideshare';

describe('Unit: renderer/render/media/slideshare', () => {
  describe('slideshare', () => {
    it('result', () => {
      assert(!slideshare('http://www.slideshare.net/Slideshare/get-started-with-slide-share'));
      assert(slideshare('https://www.slideshare.net/Slideshare/get-started-with-slide-share'));
    });

  });

});
