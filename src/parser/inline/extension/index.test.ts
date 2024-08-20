import { index } from './index';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = (source: string) => some(index)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a')), undefined);
      assert.deepStrictEqual(inspect(parser('[#*a\nb*]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#(a\nb)]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#"a\nb"]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#<bdi>a\nb</bdi>]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#[% a\nb %]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#{{ a\nb }}]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#({{ a\nb }})]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a\n|b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|\\\n]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|(\n)]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|(\\\n)]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# |]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# |b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a|]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a|b]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a| ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[# a| b]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [#a]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[#a]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a \\ ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a &nbsp;]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a <wbr>]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a [% b %]]')), [['<a class="index" href="#index::a">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ ]')), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a b]')), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  b]')), [['<a class="index" href="#index::a__b">a  b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\tb]')), [['<a class="index" href="#index::a_b=1eu1tj4">a\tb</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a_b]')), [['<a class="index" href="#index::a_b=10dxc9b">a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ b]')), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]]')), [['<a class="index" href="#index::[]">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\]]')), [['<a class="index" href="#index::]">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\\\]')), [['<a class="index" href="#index::\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#A]')), [['<a class="index" href="#index::A">A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#==]')), [['<a class="index" href="#index::==">==</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#*A*]')), [['<a class="index" href="#index::A"><em>A</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#`A`]')), [['<a class="index" href="#index::`A`"><code data-src="`A`">A</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#${A}$]')), [['<a class="index" href="#index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[A](a)]')), [['<a class="index" href="#index::A"><ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]{a}]')), [['<a class="index" href="#index::[]{a}">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#![]{a}]')), [['<a class="index" href="#index::![]{a}">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#@a]')), [['<a class="index" href="#index::@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#http://host]')), [['<a class="index" href="#index::http://host">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#!http://host]')), [['<a class="index" href="#index::!http://host">!http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[%  %]]')), [['<a class="index"><span class="remark"><input type="checkbox"><span>[%  %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[% a %]]')), [['<a class="index"><span class="remark"><input type="checkbox"><span>[% a %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a((b))]')), [['<a class="index" href="#index::a((b))">a<span class="paren">((b))</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a[[b]]]')), [['<a class="index" href="#index::a[[b]]">a[[b]]</a>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('[#|]')), [['<a class="index" href="#index::|">|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#|b]')), [['<a class="index" href="#index::|b">|b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a| ]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|\\ ]')), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b ]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b  ]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|\\b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|*b*]')), [['<a class="index" href="#index::*b*">a<span class="indexer" data-index="*b*"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b c]')), [['<a class="index" href="#index::b_c">a<span class="indexer" data-index="b_c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b  c]')), [['<a class="index" href="#index::b__c">a<span class="indexer" data-index="b__c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b\tc]')), [['<a class="index" href="#index::b_c=3p5wqt">a<span class="indexer" data-index="b_c=3p5wqt"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b_c]')), [['<a class="index" href="#index::b_c=fvw9e2">a<span class="indexer" data-index="b_c=fvw9e2"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|[]]')), [['<a class="index" href="#index::[]">a<span class="indexer" data-index="[]"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|&copy;]')), [['<a class="index" href="#index::&amp;copy;">a<span class="indexer" data-index="&amp;copy;"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a \\ |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a &nbsp;|b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a <wbr>|b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a [% b %]|c]')), [['<a class="index" href="#index::c">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span><span class="indexer" data-index="c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ |b]')), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
    });

  });

});
