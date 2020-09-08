import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/address', () => {
  describe('address', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser(' >0')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('>0')), [['<a class="address" href="?res=0" rel="noopener">&gt;0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>0aA')), [['<a class="address" href="?res=0aA" rel="noopener">&gt;0aA</a>'], '']);
    });

  });

});

