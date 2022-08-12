import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/anchor', () => {
  describe('anchor', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>-0')), undefined);
      assert.deepStrictEqual(inspect(parser('>>01#')), undefined);
      assert.deepStrictEqual(inspect(parser('>>01@')), undefined);
      assert.deepStrictEqual(inspect(parser('>>https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890')), undefined);
      assert.deepStrictEqual(inspect(parser('>>>')), undefined);
      assert.deepStrictEqual(inspect(parser('a>>0')), [['a>>0'], '']);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0')), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a')), [['<a class="anchor" href="?at=a">&gt;&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>A')), [['<a class="anchor" href="?at=A">&gt;&gt;A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-')), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('>>0-a')), [['<a class="anchor" href="?at=0-a">&gt;&gt;0-a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-A')), [['<a class="anchor" href="?at=0-A">&gt;&gt;0-A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0--a')), [['<a class="anchor" href="?at=0">&gt;&gt;0</a>'], '--a']);
      assert.deepStrictEqual(inspect(parser('>>2000-01-31-23-59-59-999-JST')), [['<a class="anchor" href="?at=2000-01-31-23-59-59-999-JST">&gt;&gt;2000-01-31-23-59-59-999-JST</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>A/2000-01-31-23-59-59-JST')), [['<a class="anchor" href="/@A/timeline/2000-01-31-23-59-59-JST">&gt;&gt;A/2000-01-31-23-59-59-JST</a>'], '']);
    });

  });

});
