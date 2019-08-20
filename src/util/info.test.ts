import { info } from './info';
import { parse } from '../parser';

describe('Unit: util/info', () => {
  describe('info', () => {
    it('empty', () => {
      assert.deepStrictEqual(
        info(parse('')),
        {
          hashtag: [],
          hashref: [],
          channel: [],
          account: [],
          mention: [],
          url: [],
          tel: [],
          email: [],
          media: [],
        });
    });

  });

});
