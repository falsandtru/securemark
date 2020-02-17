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
      assert.deepStrictEqual(inspect(parser('[#a')), undefined);
      assert.deepStrictEqual(inspect(parser('[#<# a #>]')), undefined);
      assert.deepStrictEqual(inspect(parser('[#*a\nb*]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[#a]')), [['<a class="index" href="#index:a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a ]')), [['<a class="index" href="#index:a">a </a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a b]')), [['<a class="index" href="#index:a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a  b]')), [['<a class="index" href="#index:a_b">a  b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ ]')), [['<a class="index" href="#index:a">a </a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a\\ b]')), [['<a class="index" href="#index:a_b">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]]')), [['<a class="index" href="#index:[]">[]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\]]')), [['<a class="index" href="#index:]">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\\\\]')), [['<a class="index" href="#index:\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#A]')), [['<a class="index" href="#index:A">A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#*A*]')), [['<a class="index" href="#index:A"><em>A</em></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#`A`]')), [['<a class="index" href="#index:`A`"><code data-src="`A`">A</code></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#${A}$]')), [['<a class="index" href="#index:${A}$"><span class="math notranslate" data-src="${A}$">${A}$</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[A](a)]')), [['<a class="index" href="#index:A"><ruby>A<rp>(</rp><rt>a</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#[]{a}]')), [['<a class="index" href="#index:[]{a}">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#![]{a}]')), [['<a class="index" href="#index:![]{a}">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a<# b #>]')), [['<a class="index" href="#index:a">a<sup class="comment" title="b"></sup></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#@a]')), [['<a class="index" href="#index:@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#http://host]')), [['<a class="index" href="#index:http://host">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#!http://host]')), [['<a class="index" href="#index:!http://host">!http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a((b))]')), [['<a class="index" href="#index:a((b))">a((b))</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a[[b]]]')), [['<a class="index" href="#index:a[[b]]">a[[b]]</a>'], '']);
    });

  });

});
