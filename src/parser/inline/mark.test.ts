import { mark } from './mark';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/mark', () => {
  describe('mark', () => {
    const parser = some(mark);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('=', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==a', new Context())), [['==', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a=', new Context())), [['==', 'a='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a ==', new Context())), [['==', 'a', ' ', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a  ==', new Context())), [['==', 'a', ' ', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\n==', new Context())), [['==', 'a', '<br>', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\ ==', new Context())), [['==', 'a', ' ', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\\n==', new Context())), [['==', 'a', '<br>', '=='], '']);
      assert.deepStrictEqual(inspect(parser, input('== ==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('== a==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('== a ==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==\na==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==\\\na==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('==<wbr>a==', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ==a==', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('==a==', new Context())), [['<mark id="mark::a">a</mark>', '<a href="#mark::a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a=b==', new Context())), [['<mark id="mark::a=b=3lYfIw">a=b</mark>', '<a href="#mark::a=b=3lYfIw"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==\\===', new Context())), [['<mark id="mark::=">=</mark>', '<a href="#mark::="></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a===', new Context())), [['<mark id="mark::a">a</mark>', '<a href="#mark::a"></a>'], '=']);
      assert.deepStrictEqual(inspect(parser, input('==a\nb==', new Context())), [['<mark id="mark::a_b=12Ta86">a<br>b</mark>', '<a href="#mark::a_b=12Ta86"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\\nb==', new Context())), [['<mark id="mark::a_b=12Ta86">a<br>b</mark>', '<a href="#mark::a_b=12Ta86"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('==a ==b====', new Context())), [['<mark id="mark::a_b">a <mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==- ==b====', new Context())), [['<mark id="mark::-_b">- <mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::-_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\\ ==b====', new Context())), [['<mark id="mark::a_b">a <mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a&Tab;==b====', new Context())), [['<mark id="mark::a_b=33Mw2l">a\t<mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::a_b=33Mw2l"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a<wbr>==b====', new Context())), [['<mark id="mark::ab">a<wbr><mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::ab"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==*==a==*==', new Context())), [['<mark id="mark::a"><em><mark id="mark::a">a</mark><a href="#mark::a"></a></em></mark>', '<a href="#mark::a"></a>'], '']);
    });

  });

});
