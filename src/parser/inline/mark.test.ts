import { mark } from './mark';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/mark', () => {
  describe('mark', () => {
    const parser = (source: string) => some(mark)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('=='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('==a'), ctx), [['==', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('==a='), ctx), [['==', 'a', '='], '']);
      assert.deepStrictEqual(inspect(parser('==a =='), ctx), [['==', 'a'], ' ==']);
      assert.deepStrictEqual(inspect(parser('==a  =='), ctx), [['==', 'a', ' '], ' ==']);
      assert.deepStrictEqual(inspect(parser('==a\n=='), ctx), [['==', 'a'], '\n==']);
      assert.deepStrictEqual(inspect(parser('==a\\ =='), ctx), [['==', 'a'], '\\ ==']);
      assert.deepStrictEqual(inspect(parser('==a\\\n=='), ctx), [['==', 'a'], '\\\n==']);
      assert.deepStrictEqual(inspect(parser('== =='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('== a=='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('== a =='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('==\na=='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('==\\\na=='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('==<wbr>a=='), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' ==a=='), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('==a=='), ctx), [['<mark id="mark::a">a</mark>', '<a href="#mark::a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a=b=='), ctx), [['<mark id="mark::a=b=3lYfIw">a=b</mark>', '<a href="#mark::a=b=3lYfIw"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==\\==='), ctx), [['<mark id="mark::=">=</mark>', '<a href="#mark::="></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a==='), ctx), [['<mark id="mark::a">a</mark>', '<a href="#mark::a"></a>'], '=']);
      assert.deepStrictEqual(inspect(parser('==a\nb=='), ctx), [['<mark id="mark::a_b=12Ta86">a<br>b</mark>', '<a href="#mark::a_b=12Ta86"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\\\nb=='), ctx), [['<mark id="mark::a_b=12Ta86">a<br>b</mark>', '<a href="#mark::a_b=12Ta86"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('==a ==b===='), ctx), [['<mark id="mark::a_b">a <mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\\ ==b===='), ctx), [['<mark id="mark::a_b">a <mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::a_b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a&Tab;==b===='), ctx), [['<mark id="mark::a_b=33Mw2l">a\t<mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::a_b=33Mw2l"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==a<wbr>==b===='), ctx), [['<mark id="mark::ab">a<wbr><mark id="mark::b">b</mark><a href="#mark::b"></a></mark>', '<a href="#mark::ab"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('==*==a==*=='), ctx), [['<mark id="mark::a"><em><mark id="mark::a">a</mark><a href="#mark::a"></a></em></mark>', '<a href="#mark::a"></a>'], '']);
    });

  });

});
