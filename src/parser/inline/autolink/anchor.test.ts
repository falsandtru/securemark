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
      assert.deepStrictEqual(inspect(parser('>>>')), undefined);
      assert.deepStrictEqual(inspect(parser(' >>0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>>0')), [['<a class="anchor" href="?res=0">&gt;&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>>0aA')), [['<a class="anchor" href="?res=0aA">&gt;&gt;0aA</a>'], '']);
    });

  });

});

