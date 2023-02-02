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
      assert.deepStrictEqual(inspect(parser('==a==')), [['<mark id="mark:a">a</mark>', '<a href="#mark:a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a=b==')), [['<mark id="mark:a=b">a=b</mark>', '<a href="#mark:a=b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==\\===')), [['<mark id="mark:=">=</mark>', '<a href="#mark:="></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a===')), [['<mark id="mark:a">a</mark>', '<a href="#mark:a"></a>'], '=']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('==a ==b====')), [['<mark id="mark:a_b">a <mark id="mark:b">b</mark><a href="#mark:b"></a></mark>', '<a href="#mark:a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\\ ==b====')), [['<mark id="mark:a_b">a <mark id="mark:b">b</mark><a href="#mark:b"></a></mark>', '<a href="#mark:a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a&Tab;==b====')), [['<mark id="mark:a_b">a\t<mark id="mark:b">b</mark><a href="#mark:b"></a></mark>', '<a href="#mark:a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a<wbr>==b====')), [['<mark id="mark:ab">a<wbr><mark id="mark:b">b</mark><a href="#mark:b"></a></mark>', '<a href="#mark:ab"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==_==a==_==')), [['<mark id="mark:a"><em><mark id="mark:a">a</mark><a href="#mark:a"></a></em></mark>', '<a href="#mark:a"></a>'], '']);
    });

  });

});
