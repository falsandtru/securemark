import { mark } from './mark';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/mark', () => {
  describe('mark', () => {
    const parser = some(mark);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('=')), undefined);
      assert.deepStrictEqual(inspect(parser, input('==')), [['=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a')), [['==', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a=')), [['==', 'a='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a ==')), [['==', 'a ', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a  ==')), [['==', 'a', ' ', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\n==')), [['==', 'a', '<br>', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\ ==')), [['==', 'a', ' ', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\\n==')), [['==', 'a', '<br>', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('== ==')), undefined);
      assert.deepStrictEqual(inspect(parser, input('== a==')), undefined);
      assert.deepStrictEqual(inspect(parser, input('== a ==')), undefined);
      assert.deepStrictEqual(inspect(parser, input('==\na==')), undefined);
      assert.deepStrictEqual(inspect(parser, input('==\\\na==')), undefined);
      assert.deepStrictEqual(inspect(parser, input('==<wbr>a==')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ==a==')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('==a==')), [['<mark id="mark::a">a</mark>', '<a href="#mark::a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a=b==')), [['<mark id="mark::a=b=3lYfIw">a=b</mark>', '<a href="#mark::a=b=3lYfIw"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==\\===')), [['<mark id="mark::=">=</mark>', '<a href="#mark::="></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a===')), [['<mark id="mark::a">a</mark>', '<a href="#mark::a"></a>'], '=']);
      assert.deepStrictEqual(inspect(parser, input('==a\nb==')), [['<mark id="mark::a_b=12Ta86">a<br>b</mark>', '<a href="#mark::a_b=12Ta86"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\\nb==')), [['<mark id="mark::a_b=12Ta86">a<br>b</mark>', '<a href="#mark::a_b=12Ta86"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('==a ==b====')), [['<mark id="mark::a_b">a <mark>b</mark></mark>', '<a href="#mark::a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==- ==b====')), [['<mark id="mark::-_b">- <mark>b</mark></mark>', '<a href="#mark::-_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\ ==b====')), [['<mark id="mark::a_b">a <mark>b</mark></mark>', '<a href="#mark::a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a&Tab;==b====')), [['<mark id="mark::a_b=33Mw2l">a\t<mark>b</mark></mark>', '<a href="#mark::a_b=33Mw2l"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a<wbr>==b====')), [['<mark id="mark::ab">a<wbr><mark>b</mark></mark>', '<a href="#mark::ab"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==*==a==*==')), [['<mark id="mark::a"><em><mark>a</mark></em></mark>', '<a href="#mark::a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('====a== b==')), [['<mark id="mark::a_b"><mark>a</mark> b</mark>', '<a href="#mark::a_b"></a>'], '']);
    });

  });

});
