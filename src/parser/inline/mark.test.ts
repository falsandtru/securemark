import { mark } from './mark';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/mark', () => {
  describe('mark', () => {
    const parser = (source: string) => some(mark)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('=')), undefined);
      assert.deepStrictEqual(inspect(parser('==')), undefined);
      assert.deepStrictEqual(inspect(parser('==a')), [['==', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('==a=')), [['==', 'a', '='], '']);
      assert.deepStrictEqual(inspect(parser('==a ==')), [['==', 'a'], ' ==']);
      assert.deepStrictEqual(inspect(parser('==a  ==')), [['==', 'a', ' '], ' ==']);
      assert.deepStrictEqual(inspect(parser('==a\n==')), [['==', 'a'], '\n==']);
      assert.deepStrictEqual(inspect(parser('==a\nb==')), [['==', 'a'], '\nb==']);
      assert.deepStrictEqual(inspect(parser('==a\\ ==')), [['==', 'a'], '\\ ==']);
      assert.deepStrictEqual(inspect(parser('==a\\\n==')), [['==', 'a'], '\\\n==']);
      assert.deepStrictEqual(inspect(parser('==a\\\nb==')), [['==', 'a'], '\\\nb==']);
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
      assert.deepStrictEqual(inspect(parser('==a=b==')), [['<mark>a=b</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==\\===')), [['<mark>=</mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a===')), [['<mark>a</mark>'], '=']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('==a ==b====')), [['<mark>a <mark>b</mark></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\\ ==b====')), [['<mark>a <mark>b</mark></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a&Tab;==b====')), [['<mark>a\t<mark>b</mark></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==a<wbr>==b====')), [['<mark>a<wbr><mark>b</mark></mark>'], '']);
      assert.deepStrictEqual(inspect(parser('==_==a==_==')), [['<mark><em><mark>a</mark></em></mark>'], '']);
    });

  });

});
