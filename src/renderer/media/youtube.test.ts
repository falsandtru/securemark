import { youtube } from './youtube';
import DOM from 'typed-dom';

describe('Unit: renderer/media/youtube', () => {
  describe('youtube', () => {
    it('result', () => {
      assert(!youtube(DOM.img({ 'data-src': 'http://youtu.be/xRF7WIZV4lA' }, '').element));
      assert(youtube(DOM.img({ 'data-src': 'https://youtu.be/xRF7WIZV4lA' }, '').element));
      assert(!youtube(DOM.img({ 'data-src': 'http://www.youtube.com/watch?v=xRF7WIZV4lA' }, '').element));
      assert(youtube(DOM.img({ 'data-src': 'https://www.youtube.com/watch?v=xRF7WIZV4lA' }, '').element));
    });

  });

});
