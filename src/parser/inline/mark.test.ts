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
      assert.deepStrictEqual(inspect(parser('===')), undefined);
      assert.deepStrictEqual(inspect(parser('====')), undefined);
      assert.deepStrictEqual(inspect(parser('=====')), undefined);
      assert.deepStrictEqual(inspect(parser('====a==b==')), undefined);
      assert.deepStrictEqual(inspect(parser('====a==b==c====')), undefined);
      assert.deepStrictEqual(inspect(parser('a==a==')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('==a==')), [['<mark>a</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a===')), [['<mark>a</mark>'], '=']);
      assert.deepStrictEqual(inspect(parser('==a ==')), [['<mark>a </mark>'], '']);
      assert.deepStrictEqual(inspect(parser('== a==')), [['<mark> a</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('== a ==')), [['<mark> a </mark>'], '']);
      assert.deepStrictEqual(inspect(parser('== ==')), [['<mark> </mark>'], '']);
      assert.deepStrictEqual(inspect(parser('===a==')), [['<mark>=a</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('===a===')), [['<mark>=a</mark>'], '=']);
      assert.deepStrictEqual(inspect(parser('==\n==')), [['<mark><br></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==\\\n==')), [['<mark><span class="linebreak"> </span></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==<wbr>==')), [['<mark><wbr></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==ab==')), [['<mark>ab</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\nb==')), [['<mark>a<br>b</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\\\nb==')), [['<mark>a<span class="linebreak"> </span>b</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==\\===')), [['<mark>=</mark>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('==*==a==*==')), [['<mark><em><span class="invalid" data-invalid-syntax="mark" data-invalid-type="nesting">==a==</span></em></mark>'], '']);
    });

  });

});
