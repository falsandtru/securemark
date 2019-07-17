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
      assert.deepStrictEqual(inspect(parser('@a#1')), undefined);
      assert.deepStrictEqual(inspect(parser('@a#b#')), undefined);
      assert.deepStrictEqual(inspect(parser('@a#b#1')), undefined);
      assert.deepStrictEqual(inspect(parser('a@b')), undefined);
      assert.deepStrictEqual(inspect(parser(' @a#b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#c')), [['<a class="channel" rel="noopener">@a#b#c</a>'], '']);
    });

  });

});
