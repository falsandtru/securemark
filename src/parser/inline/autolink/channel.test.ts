import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/channel', () => {
  describe('channel', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

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
      assert.deepStrictEqual(inspect(parser('@a#domain/b')), [['@a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#domain/b')), [['@domain/a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#b#c')), [['<a class="channel" href="/@a?ch=b+c">@a#b#c</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#b')), [['<a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a>'], '']);
    });

  });

});
