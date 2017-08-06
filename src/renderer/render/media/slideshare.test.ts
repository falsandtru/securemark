import { slideshare } from './slideshare';

describe('Unit: renderer/media/slideshare', () => {
  describe('slideshare', () => {
    it('result', () => {
      assert(slideshare('https://www.slideshare.net/Slideshare/get-started-with-slide-share'));
    });

  });

});
