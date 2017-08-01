import { slideshare } from './slideshare';

describe('Unit: renderer/media/slideshare', () => {
  describe('slideshare', () => {
    it('result', () => {
      assert(!slideshare('http://www.slideshare.net/Slideshare/an-overview-to-slideshare-for-business'));
      assert(slideshare('https://www.slideshare.net/Slideshare/an-overview-to-slideshare-for-business'));
    });

  });

});
