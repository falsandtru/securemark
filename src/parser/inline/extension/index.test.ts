import { index } from './index';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = (source: string) => some(index)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# a]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# a ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\ a]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#\n]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\\n]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#\\]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#*a\nb*]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#(a\nb)]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#"a\nb"]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#<bdi>a\nb</bdi>]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#[% a\nb %]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#{{ a\nb }}]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#({{ a\nb }})]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#a\n|b]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|\n]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|\\\n]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|(\n)]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[#a|(\\\n)]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# |]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# |b]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# a|]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# a|b]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# a| ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[# a| b]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [#a]'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[#a]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a ]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  ]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a \\ ]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a &nbsp;]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a <wbr>]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a [% b %]]'), ctx), [['<a class="index" href="#index::a">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ ]'), ctx), [['<a class="index" href="#index::a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a b]'), ctx), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  b]'), ctx), [['<a class="index" href="#index::a__b">a  b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\tb]'), ctx), [['<a class="index" href="#index::a_b=33Mw2l">a\tb</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a_b]'), ctx), [['<a class="index" href="#index::a_b=2H8oCG">a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ b]'), ctx), [['<a class="index" href="#index::a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]]'), ctx), [['<a class="index" href="#index::[]">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\]]'), ctx), [['<a class="index" href="#index::]">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\\\]'), ctx), [['<a class="index" href="#index::\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#A]'), ctx), [['<a class="index" href="#index::A">A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#==]'), ctx), [['<a class="index" href="#index::==">==</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#*A*]'), ctx), [['<a class="index" href="#index::A"><em>A</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#`A`]'), ctx), [['<a class="index" href="#index::`A`"><code data-src="`A`">A</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#${A}$]'), ctx), [['<a class="index" href="#index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[A](a)]'), ctx), [['<a class="index" href="#index::A"><ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]{a}]'), ctx), [['<a class="index" href="#index::[]{a}">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#![]{a}]'), ctx), [['<a class="index" href="#index::![]{a}">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#@a]'), ctx), [['<a class="index" href="#index::@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#http://host]'), ctx), [['<a class="index" href="#index::http://host">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#!http://host]'), ctx), [['<a class="index" href="#index::!http://host">!http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[%  %]]'), ctx), [['<a class="index"><span class="remark"><input type="checkbox"><span>[%  %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[% a %]]'), ctx), [['<a class="index"><span class="remark"><input type="checkbox"><span>[% a %]</span></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a((b))]'), ctx), [['<a class="index" href="#index::a((b))">a<span class="paren">((b))</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a[[b]]]'), ctx), [['<a class="index" href="#index::a[[b]]">a[[b]]</a>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('[#|]'), ctx), [['<a class="index" href="#index::|">|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#|b]'), ctx), [['<a class="index" href="#index::|b">|b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|]'), ctx), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a| ]'), ctx), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|\\ ]'), ctx), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b ]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b  ]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|\\b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|*b*]'), ctx), [['<a class="index" href="#index::*b*">a<span class="indexer" data-index="*b*"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|*]*]'), ctx), [['<a class="index" href="#index::*">a<span class="indexer" data-index="*"></span></a>'], '*]']);
      assert.deepStrictEqual(inspect(parser('[#a|b c]'), ctx), [['<a class="index" href="#index::b_c">a<span class="indexer" data-index="b_c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b  c]'), ctx), [['<a class="index" href="#index::b__c">a<span class="indexer" data-index="b__c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b\tc]'), ctx), [['<a class="index" href="#index::b_c=xeqYk">a<span class="indexer" data-index="b_c=xeqYk"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|b_c]'), ctx), [['<a class="index" href="#index::b_c=KUxv5">a<span class="indexer" data-index="b_c=KUxv5"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|\\[\\]]'), ctx), [['<a class="index" href="#index::[]">a<span class="indexer" data-index="[]"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|&copy;]'), ctx), [['<a class="index" href="#index::©">a<span class="indexer" data-index="©"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|&nbsp;]'), ctx), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a|<wbr>]'), ctx), [['<a class="index" href="#index::a|">a|</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a |b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  |b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a \\ |b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a &nbsp;|b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a <wbr>|b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a [% b %]|c]'), ctx), [['<a class="index" href="#index::c">a <span class="remark"><input type="checkbox"><span>[% b %]</span></span><span class="indexer" data-index="c"></span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ |b]'), ctx), [['<a class="index" href="#index::b">a<span class="indexer" data-index="b"></span></a>'], '']);
    });

  });

});
