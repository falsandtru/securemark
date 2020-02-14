import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('@a@')), [['@a@'], '']);
      assert.deepStrictEqual(inspect(parser('@a@1')), [['@a@1'], '']);
      assert.deepStrictEqual(inspect(parser('@a#')), [['@a#'], '']);
      assert.deepStrictEqual(inspect(parser('@a#1')), [['@a#1'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b@')), [['@a#b@'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b@1')), [['@a#b@1'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#')), [['@a#b#'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#1')), [['@a#b#1'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#1b')), [['<a class="channel" rel="noopener">@a#1b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#c')), [['<a class="channel" rel="noopener">@a#b#c</a>'], '']);
    });

  });

});
