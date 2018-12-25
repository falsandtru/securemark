﻿import { ruby } from './ruby';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/ruby', () => {
  describe('ruby', () => {
    const parser = some(ruby);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[](b)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ ](b)')), undefined);
      assert.deepStrictEqual(inspect(parser('[ a](b)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a ]( b)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a](a b)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a]()')), undefined);
      assert.deepStrictEqual(inspect(parser('[a]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('[a\nb](c)')), undefined);
      assert.deepStrictEqual(inspect(parser('[a](b\nc)')), undefined);
      assert.deepStrictEqual(inspect(parser('a[b](c)')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[A](a)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A](ab)')), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A ](a)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a)')), [['<ruby>AB<rp>(</rp><rt>a</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a )')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB]( b)')), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](ab)')), [['<ruby>AB<rp>(</rp><rt>ab</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[AB](a b)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A B](ab)')), [['<ruby>A<rp>(</rp><rt>ab</rt><rp>)</rp>B<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[A B](a b)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rp>(</rp><rt>b</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[ABC]( b )')), [['<ruby>A<rt></rt>B<rp>(</rp><rt>b</rt><rp>)</rp>C<rt></rt></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[ABC](a  c)')), [['<ruby>A<rp>(</rp><rt>a</rt><rp>)</rp>B<rt></rt>C<rp>(</rp><rt>c</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[東方](とう ほう)')), [['<ruby>東<rp>(</rp><rt>とう</rt><rp>)</rp>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[&amp;](&amp;)')), [['<ruby>&amp;<rp>(</rp><rt>&amp;</rt><rp>)</rp></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('[*A*](*a*)')), [['<ruby>*A*<rp>(</rp><rt>*a*</rt><rp>)</rp></ruby>'], '']);
    });

  });

});
