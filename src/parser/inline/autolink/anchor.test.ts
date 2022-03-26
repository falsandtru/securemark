import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/anchor', () => {
  describe('anchor', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>0A')), undefined);
      assert.deepStrictEqual(inspect(parser('>>A')), undefined);
      assert.deepStrictEqual(inspect(parser('>>-0')), undefined);
      assert.deepStrictEqual(inspect(parser('>>01#')), undefined);
      assert.deepStrictEqual(inspect(parser('>>01@')), undefined);
      assert.deepStrictEqual(inspect(parser('>>https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('>>tel:1234567890')), undefined);
      assert.deepStrictEqual(inspect(parser('>>>')), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0')), [['<a href="?at=0" class="anchor">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a')), [['<a href="?at=a" class="anchor">&gt;&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-')), [['<a href="?at=0" class="anchor">&gt;&gt;0</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('>>0-a')), [['<a href="?at=0-a" class="anchor">&gt;&gt;0-a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-A')), [['<a href="?at=0" class="anchor">&gt;&gt;0</a>'], '-A']);
      assert.deepStrictEqual(inspect(parser('>>0--a')), [['<a href="?at=0" class="anchor">&gt;&gt;0</a>'], '--a']);
    });

  });

});
