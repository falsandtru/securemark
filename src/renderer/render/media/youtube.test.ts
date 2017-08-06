import { youtube } from './youtube';

describe('Unit: renderer/media/youtube', () => {
  describe('youtube', () => {
    it('result', () => {
      assert(youtube('https://youtu.be/xRF7WIZV4lA'));
      assert(youtube('https://www.youtube.com/watch?v=xRF7WIZV4lA'));
    });

  });

});
