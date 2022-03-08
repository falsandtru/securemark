import { info } from './info';
import { parse } from '../parser';

describe('Unit: util/info', () => {
  describe('info', () => {
    it('empty', () => {
      assert.deepStrictEqual(
        info(parse('')),
        {
          url: [],
          tel: [],
          email: [],
          account: [],
          channel: [],
          hashtag: [],
          hashnum: [],
          reply: [],
          anchor: [],
          media: [],
        });
    });

  });

});
