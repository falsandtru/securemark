import { index } from './index';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = some(index);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\ ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\ a]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\n]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\\n]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#\\]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#*a\nb*]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#(a\nb)]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#"a\nb"]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#<bdi>a\nb</bdi>]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#[% a\nb %]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#{{ a\nb }}]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#({{ a\nb }})]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a\n|b]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|\n]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\\n]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|(\n)]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[#a|(\\\n)]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# |]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# |b]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a|]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a|b]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a| ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[# a| b]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [#a]', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[#a]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a ]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a  ]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a \\ ]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a &nbsp;]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a <wbr>]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a [% b %]]', new Context())), [['<a class="index" href="#index::a">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\\ ]', new Context())), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a b]', new Context())), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a  b]', new Context())), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\tb]', new Context())), [['<a class="index" href="#index::a_b=33Mw2l">a\tb</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a_b]', new Context())), [['<a class="index" href="#index::a_b=2H8oCG">a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\\ b]', new Context())), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[]]', new Context())), [['<a class="index" href="#index::[]">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#\\]]', new Context())), [['<a class="index" href="#index::]">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#\\\\]', new Context())), [['<a class="index" href="#index::\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#A]', new Context())), [['<a class="index" href="#index::A">A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#==]', new Context())), [['<a class="index" href="#index::==">==</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#*A*]', new Context())), [['<a class="index" href="#index::A"><em>A</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#`A`]', new Context())), [['<a class="index" href="#index::`A`"><code data-src="`A`">A</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#${A}$]', new Context())), [['<a class="index" href="#index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[A](a)]', new Context())), [['<a class="index" href="#index::A"><ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[]{a}]', new Context())), [['<a class="index" href="#index::[]{a}">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#![]{a}]', new Context())), [['<a class="index" href="#index::![]{a}">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#@a]', new Context())), [['<a class="index" href="#index::@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#http://host]', new Context())), [['<a class="index" href="#index::http://host">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#!http://host]', new Context())), [['<a class="index" href="#index::!http://host">!http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[%  %]]', new Context())), [['<a class="index"><span class="remark"><input type="checkbox"><span>[% %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#[% a %]]', new Context())), [['<a class="index"><span class="remark"><input type="checkbox"><span>[% a %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a((b))]', new Context())), [['<a class="index" href="#index::a((b))">a<span class="paren">(<span class="paren">(b)</span>)</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a[[b]]]', new Context())), [['<a class="index" href="#index::a[[b]]">a[[b]]</a>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('[#|]', new Context())), [['<a class="index" href="#index::|">|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#|b]', new Context())), [['<a class="index" href="#index::|b">|b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|]', new Context())), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a| ]', new Context())), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\ ]', new Context())), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b ]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b  ]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|*b*]', new Context())), [['<a class="index" href="#index::*b*">a<span class="indexer" data-index="*b*"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|*]*]', new Context())), [['<a class="index" href="#index::*">a<span class="indexer" data-index="*"></span></a>'], '*]']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b c]', new Context())), [['<a class="index" href="#index::b_c">a<span class="indexer" data-index="b_c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b  c]', new Context())), [['<a class="index" href="#index::b_c">a<span class="indexer" data-index="b_c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b\tc]', new Context())), [['<a class="index" href="#index::b_c=xeqYk">a<span class="indexer" data-index="b_c=xeqYk"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|b_c]', new Context())), [['<a class="index" href="#index::b_c=KUxv5">a<span class="indexer" data-index="b_c=KUxv5"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|\\[\\]]', new Context())), [['<a class="index" href="#index::[]">a<span class="indexer" data-index="[]"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&]', new Context())), [['<a class="index" href="#index::&amp;">a<span class="indexer" data-index="&amp;"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&copy]', new Context())), [['<a class="index" href="#index::&amp;copy">a<span class="indexer" data-index="&amp;copy"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&copy;]', new Context())), [['<a class="index" href="#index::©">a<span class="indexer" data-index="©"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|&nbsp;]', new Context())), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a|<wbr>]', new Context())), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a |b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a  |b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a \\ |b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a &nbsp;|b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a <wbr>|b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a [% b %]|c]', new Context())), [['<a class="index" href="#index::c">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span><span class="indexer" data-index="c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a\\ |b]', new Context())), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
    });

  });

});
