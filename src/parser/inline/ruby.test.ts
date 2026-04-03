import { ruby } from './ruby';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/ruby', () => {
  describe('ruby', () => {
    const parser = some(ruby);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[(b)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]()')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[](b)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ ](b)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ a](b)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&Tab;a](b)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&Tab; a](b)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&a;](b)')), [['<ruby>&amp;a;<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a](&a;)')), [['<ruby>a<rp>(</rp><rt>&amp;a;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[<wbr>](a)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a](<wbr>)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]()')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]( )')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a\nb](c)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a](b\nc)')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [a](b)')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[A](a)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A](ab)')), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A](a b)')), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A ](a)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A ](a b)')), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A ](a b )')), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A  ](a)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp><rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A \\ ](a)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp> <rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a)')), [['<ruby>AB<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a )')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB]( b)')), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](ab)')), [['<ruby>AB<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a b)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a b )')), [['<ruby>AB<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[AB](a b c)')), [['<ruby>AB<rp>(</rp><rt>a b c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A B](ab)')), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A B](a b)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[A B](a b )')), [['<ruby>A B<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](a )')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](a  )')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC]( b)')), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC]( b )')), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](  c)')), [['<ruby>A<rt></rt>B<rt></rt>C<rp>(</rp><rt>c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[ABC](a  c)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rp>(</rp><rt>c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[東方](とう　ほう)')), [['<ruby>東<rp>(</rp><rt>とう</rt><rp>)</rp>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[秦　\\　　こころ](はた　の　こころ)')), [['<ruby>秦<rp>(</rp><rt>はた</rt><rp>)</rp>　<rp>(</rp><rt>の</rt><rp>)</rp>こころ<rp>(</rp><rt>こころ</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[秦　&nbsp;　こころ](はた　の　こころ)')), [['<ruby>秦<rp>(</rp><rt>はた</rt><rp>)</rp>&nbsp;<rp>(</rp><rt>の</rt><rp>)</rp>こころ<rp>(</rp><rt>こころ</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[&&](&&)')), [['<ruby>&amp;&amp;<rp>(</rp><rt>&amp;&amp;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[&copy;](&copy;)')), [['<ruby>©<rp>(</rp><rt>©</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[&amp;copy;](&amp;copy;)')), [['<ruby>&amp;copy;<rp>(</rp><rt>&amp;copy;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[*A*](*a*)')), [['<ruby>*A*<rp>(</rp><rt>*a*</rt><rp>)</rp></ruby>'], '']);
    });

  });

});
