import { info } from './info';
import { run, parse } from '../api';

describe('Unit: util/info', () => {
  describe('info', () => {
    it('empty', () => {
      assert.deepStrictEqual(
        info(run(parse(''))),
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
