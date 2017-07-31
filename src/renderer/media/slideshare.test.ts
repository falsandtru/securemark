import { slideshare } from './slideshare';
import DOM from 'typed-dom';

describe('Unit: renderer/media/slideshare', () => {
  describe('slideshare', () => {
    it('result', () => {
      assert(!slideshare(DOM.img({ 'data-src': 'http://www.slideshare.net/Slideshare/an-overview-to-slideshare-for-business' }, '').element));
      assert(slideshare(DOM.img({ 'data-src': 'https://www.slideshare.net/Slideshare/an-overview-to-slideshare-for-business' }, '').element));
    });

  });

});
