import { twitter } from './twitter';

describe('Unit: renderer/media/twitter', () => {
  describe('twitter', () => {
    it('result', () => {
      assert(twitter('https://twitter.com/hourenso_u/status/856828123882676225'));
    });

  });

});
