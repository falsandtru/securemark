import { twitter } from './twitter';
import DOM from 'typed-dom';

describe('Unit: renderer/media/twitter', () => {
  describe('twitter', () => {
    it('result', () => {
      assert(!twitter(DOM.img({ 'data-src': 'http://twitter.com/hourenso_u/status/856828123882676225' }, '').element));
      assert(twitter(DOM.img({ 'data-src': 'https://twitter.com/hourenso_u/status/856828123882676225' }, '').element));
    });

  });

});
