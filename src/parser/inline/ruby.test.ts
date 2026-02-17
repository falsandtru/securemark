import { ruby } from './ruby';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/ruby', () => {
  describe('ruby', () => {
    const parser = (source: string) => some(ruby)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[(b)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]()'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[](b)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[ ](b)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[ a](b)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[&Tab;a](b)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[&Tab; a](b)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[&a;](b)'), ctx), [['<ruby>&amp;a;<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](&a;)'), ctx), [['<ruby>a<rp>(</rp><rt>&amp;a;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[<wbr>](a)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a](<wbr>)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a]()'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a]( )'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a\nb](c)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a](b\nc)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [a](b)'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[A](a)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A](ab)'), ctx), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A](a b)'), ctx), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A ](a)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A ](a b)'), ctx), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A ](a b )'), ctx), [['<ruby>A<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A  ](a)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp><rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A \\ ](a)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp> <rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a)'), ctx), [['<ruby>AB<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a )'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB]( b)'), ctx), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](ab)'), ctx), [['<ruby>AB<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a b)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a b )'), ctx), [['<ruby>AB<rp>(</rp><rt>a b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a b c)'), ctx), [['<ruby>AB<rp>(</rp><rt>a b c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A B](ab)'), ctx), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A B](a b)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[ABC]( b )'), ctx), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[ABC](a  c)'), ctx), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rp>(</rp><rt>c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[東方](とう　ほう)'), ctx), [['<ruby>東<rp>(</rp><rt>とう</rt><rp>)</rp>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[秦　\\　　こころ](はた　の　こころ)'), ctx), [['<ruby>秦<rp>(</rp><rt>はた</rt><rp>)</rp>　<rp>(</rp><rt>の</rt><rp>)</rp>こころ<rp>(</rp><rt>こころ</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[秦　&nbsp;　こころ](はた　の　こころ)'), ctx), [['<ruby>秦<rp>(</rp><rt>はた</rt><rp>)</rp>&nbsp;<rp>(</rp><rt>の</rt><rp>)</rp>こころ<rp>(</rp><rt>こころ</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[&&](&&)'), ctx), [['<ruby>&amp;&amp;<rp>(</rp><rt>&amp;&amp;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[&copy;](&copy;)'), ctx), [['<ruby>©<rp>(</rp><rt>©</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[&amp;copy;](&amp;copy;)'), ctx), [['<ruby>&amp;copy;<rp>(</rp><rt>&amp;copy;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[*A*](*a*)'), ctx), [['<ruby>*A*<rp>(</rp><rt>*a*</rt><rp>)</rp></ruby>'], '']);
    });

  });

});
