import { channel } from './channel';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = some(channel);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('@a')), undefined);
      assert.deepStrictEqual(inspect(parser('@a#')), undefined);
      assert.deepStrictEqual(inspect(parser('@a#1#')), undefined);
      assert.deepStrictEqual(inspect(parser('a@b')), undefined);
      assert.deepStrictEqual(inspect(parser(' @a#1')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a#1')), [['<a class="channel" rel="noopener">@a#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#1#2')), [['<a class="channel" rel="noopener">@a#1#2</a>'], '']);
    });

  });

});
