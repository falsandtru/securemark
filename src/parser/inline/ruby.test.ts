import { ruby } from './ruby';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/ruby', () => {
  describe('ruby', () => {
    const parser = some(ruby);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[(b)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]()', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[](b)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ ](b)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ a](b)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&Tab;a](b)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&Tab; a](b)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&a;](b)', new Context())), [['<ruby>&amp;a;<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a](&a;)', new Context())), [['<ruby>a<rp>(</rp><rt>&amp;a;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[<wbr>](a)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a](<wbr>)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]()', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]( )', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a\nb](c)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a](b\nc)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [a](b)', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[A](a)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A](ab)', new Context())), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A](a b)', new Context())), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A ](a)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A ](a b)', new Context())), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A ](a b )', new Context())), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A  ](a)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp><rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A \\ ](a)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp> <rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a)', new Context())), [['<ruby>AB<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a )', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB]( b)', new Context())), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](ab)', new Context())), [['<ruby>AB<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a b)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a b )', new Context())), [['<ruby>AB<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a b c)', new Context())), [['<ruby>AB<rp>(</rp><rt>a b c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A B](ab)', new Context())), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A B](a b)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A B](a b )', new Context())), [['<ruby>A B<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](a )', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](a  )', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC]( b)', new Context())), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC]( b )', new Context())), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](  c)', new Context())), [['<ruby>A<rt></rt>B<rt></rt>C<rp>(</rp><rt>c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](a  c)', new Context())), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rp>(</rp><rt>c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[東方](とう　ほう)', new Context())), [['<ruby>東<rp>(</rp><rt>とう</rt><rp>)</rp>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[秦　\\　　こころ](はた　の　こころ)', new Context())), [['<ruby>秦<rp>(</rp><rt>はた</rt><rp>)</rp>　<rp>(</rp><rt>の</rt><rp>)</rp>こころ<rp>(</rp><rt>こころ</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[秦　&nbsp;　こころ](はた　の　こころ)', new Context())), [['<ruby>秦<rp>(</rp><rt>はた</rt><rp>)</rp>&nbsp;<rp>(</rp><rt>の</rt><rp>)</rp>こころ<rp>(</rp><rt>こころ</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[&&](&&)', new Context())), [['<ruby>&amp;&amp;<rp>(</rp><rt>&amp;&amp;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[&copy;](&copy;)', new Context())), [['<ruby>©<rp>(</rp><rt>©</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[&amp;copy;](&amp;copy;)', new Context())), [['<ruby>&amp;copy;<rp>(</rp><rt>&amp;copy;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[*A*](*a*)', new Context())), [['<ruby>*A*<rp>(</rp><rt>*a*</rt><rp>)</rp></ruby>'], '']);
    });

  });

});
