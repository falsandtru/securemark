import { index } from './index';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = some(index);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\ ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\ a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\n]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\\n]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#*a\nb*]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#(a\nb)]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#"a\nb"]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#<bdi>a\nb</bdi>]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#[% a\nb %]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#{{ a\nb }}]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#({{ a\nb }})]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a\n|b]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|\n]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\\n]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|(\n)]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|(\\\n)]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# |]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# |b]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a|]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a|b]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a| ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a| b]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [#a]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[#a]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a  ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a \\ ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a &nbsp;]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a <wbr>]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a [% b %]]')), [['<a class="index" href="#index::a">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\\ ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a b]')), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a  b]')), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\tb]')), [['<a class="index" href="#index::a_b=33Mw2l">a\tb</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a_b]')), [['<a class="index" href="#index::a_b=2H8oCG">a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\\ b]')), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[]]')), [['<a class="index" href="#index::[]">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#\\]]')), [['<a class="index" href="#index::]">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#\\\\]')), [['<a class="index" href="#index::\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#A]')), [['<a class="index" href="#index::A">A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#==]')), [['<a class="index" href="#index::==">==</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#*A*]')), [['<a class="index" href="#index::A"><em>A</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#`A`]')), [['<a class="index" href="#index::`A`"><code data-src="`A`">A</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#${A}$]')), [['<a class="index" href="#index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[A](a)]')), [['<a class="index" href="#index::A"><ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[]{a}]')), [['<a class="index" href="#index::[]{a}">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#![]{a}]')), [['<a class="index" href="#index::![]{a}">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#@a]')), [['<a class="index" href="#index::@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#http://host]')), [['<a class="index" href="#index::http://host">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#!http://host]')), [['<a class="index" href="#index::!http://host">!http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[%  %]]')), [['<a class="index"><span class="remark"><input type="checkbox"><span>[% %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[% a %]]')), [['<a class="index"><span class="remark"><input type="checkbox"><span>[% a %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a((b))]')), [['<a class="index" href="#index::a((b))">a<span class="paren">(<span class="paren">(b)</span>)</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a[[b]]]')), [['<a class="index" href="#index::a[[b]]">a[[b]]</a>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('[#|]')), [['<a class="index" href="#index::|">|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#|b]')), [['<a class="index" href="#index::|b">|b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a| ]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\ ]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b ]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b  ]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|*b*]')), [['<a class="index" href="#index::*b*">a<span class="indexer" data-index="*b*"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|*]*]')), [['<a class="index" href="#index::*">a<span class="indexer" data-index="*"></span></a>'], '*]']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b c]')), [['<a class="index" href="#index::b_c">a<span class="indexer" data-index="b_c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b  c]')), [['<a class="index" href="#index::b_c">a<span class="indexer" data-index="b_c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b\tc]')), [['<a class="index" href="#index::b_c=xeqYk">a<span class="indexer" data-index="b_c=xeqYk"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b_c]')), [['<a class="index" href="#index::b_c=KUxv5">a<span class="indexer" data-index="b_c=KUxv5"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\[\\]]')), [['<a class="index" href="#index::[]">a<span class="indexer" data-index="[]"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&]')), [['<a class="index" href="#index::&amp;">a<span class="indexer" data-index="&amp;"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&copy]')), [['<a class="index" href="#index::&amp;copy">a<span class="indexer" data-index="&amp;copy"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&copy;]')), [['<a class="index" href="#index::©">a<span class="indexer" data-index="©"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&nbsp;]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|<wbr>]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a  |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a \\ |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a &nbsp;|b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a <wbr>|b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a [% b %]|c]')), [['<a class="index" href="#index::c">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span><span class="indexer" data-index="c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\\ |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
    });

  });

});
