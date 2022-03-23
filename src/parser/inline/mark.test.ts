import { mark } from './mark';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/mark', () => {
  describe('mark', () => {
    const parser = (source: string) => some(mark)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('=')), undefined);
      assert.deepStrictEqual(inspect(parser('==')), undefined);
      assert.deepStrictEqual(inspect(parser('==a')), [['==', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('==a=')), [['==', 'a', '='], '']);
      assert.deepStrictEqual(inspect(parser('==a ==')), [['==', 'a', ' '], '==']);
      assert.deepStrictEqual(inspect(parser('==a\n==')), [['==', 'a', '<br>'], '==']);
      assert.deepStrictEqual(inspect(parser('==a\\ ==')), [['==', 'a', ' '], '==']);
      assert.deepStrictEqual(inspect(parser('==a\\\n==')), [['==', 'a', '<span class="linebreak"> </span>'], '==']);
      assert.deepStrictEqual(inspect(parser('== ==')), undefined);
      assert.deepStrictEqual(inspect(parser('== a==')), undefined);
      assert.deepStrictEqual(inspect(parser('== a ==')), undefined);
      assert.deepStrictEqual(inspect(parser('==\na==')), undefined);
      assert.deepStrictEqual(inspect(parser('==\\\na==')), undefined);
      assert.deepStrictEqual(inspect(parser('==<wbr>a==')), undefined);
      assert.deepStrictEqual(inspect(parser(' ==a==')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('==a==')), [['<mark>a</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==ab==')), [['<mark>ab</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\nb==')), [['<mark>a<br>b</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\\\nb==')), [['<mark>a<span class="linebreak"> </span>b</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==\\===')), [['<mark>=</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a===')), [['<mark>a</mark>'], '=']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('==*==a==*==')), [['<mark><em><mark>a</mark></em></mark>'], '']);
    });

  });

});
