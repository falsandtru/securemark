import { index } from './index';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/extension/index', () => {
  describe('index', () => {
    const parser = (source: string) => some(index)(source, {});

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
      assert.deepStrictEqual(inspect(parser('[#<# a #>]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[#a]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a ]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a b]')), [['<a href="#index:a_b" rel="noopener" class="index">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  b]')), [['<a href="#index:a_b" rel="noopener" class="index">a  b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ ]')), [['<a href="#index:a" rel="noopener" class="index">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ b]')), [['<a href="#index:a_b" rel="noopener" class="index">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]]')), [['<a href="#index:[]" rel="noopener" class="index">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\]]')), [['<a href="#index:]" rel="noopener" class="index">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\\\]')), [['<a href="#index:\\" rel="noopener" class="index">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#A]')), [['<a href="#index:A" rel="noopener" class="index">A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#*A*]')), [['<a href="#index:A" rel="noopener" class="index"><em>A</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#`A`]')), [['<a href="#index:`A`" rel="noopener" class="index"><code data-src="`A`">A</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#${A}$]')), [['<a href="#index:${A}$" rel="noopener" class="index"><span class="math notranslate" data-src="${A}$">${A}$</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[A](a)]')), [['<a href="#index:A" rel="noopener" class="index"><ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]{a}]')), [['<a href="#index:[]{a}" rel="noopener" class="index">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#![]{a}]')), [['<a href="#index:![]{a}" rel="noopener" class="index">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a<# b #>]')), [['<a href="#index:a" rel="noopener" class="index">a<sup class="comment" title="b"></sup></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#@a]')), [['<a href="#index:@a" rel="noopener" class="index">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#http://host]')), [['<a href="#index:http://host" rel="noopener" class="index">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#!http://host]')), [['<a href="#index:!http://host" rel="noopener" class="index">!http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a((b))]')), [['<a href="#index:a((b))" rel="noopener" class="index">a((b))</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a[[b]]]')), [['<a href="#index:a[[b]]" rel="noopener" class="index">a[[b]]</a>'], '']);
    });

  });

});
