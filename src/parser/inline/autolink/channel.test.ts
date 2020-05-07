import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('@a@')), [['@a@'], '']);
      assert.deepStrictEqual(inspect(parser('@a@b')), [['@a@b'], '']);
      assert.deepStrictEqual(inspect(parser('@a#')), [['@a#'], '']);
      assert.deepStrictEqual(inspect(parser('@a#1')), [['@a#1'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b@')), [['@a#b@'], '']);
      assert.deepStrictEqual(inspect(parser('@a#1@b')), [['@a#1@b'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#')), [['@a#b#'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#1')), [['@a#b#1'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#c')), [['<a class="channel" href="/@a?ch=b+c" rel="noopener">@a#b#c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain.com/a#b')), [['<a class="channel" href="https://domain.com/@a?ch=b" rel="noopener">@domain.com/a#b</a>'], '']);
    });

  });

});
