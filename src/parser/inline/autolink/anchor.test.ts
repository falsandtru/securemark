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
      assert.deepStrictEqual(inspect(parser('>>-0')), undefined);
      assert.deepStrictEqual(inspect(parser('>>>')), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0')), [['<a href="?res=0" class="anchor">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a')), [['<a href="?res=a" class="anchor">&gt;&gt;a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>A')), [['<a href="?res=A" class="anchor">&gt;&gt;A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0-')), [['<a href="?res=0" class="anchor">&gt;&gt;0</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('>>0--a')), [['<a href="?res=0" class="anchor">&gt;&gt;0</a>'], '--a']);
      assert.deepStrictEqual(inspect(parser('>>0-a-A')), [['<a href="?res=0-a-A" class="anchor">&gt;&gt;0-a-A</a>'], '']);
    });

  });

});

