import { heading } from './heading';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = some(heading);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), undefined);
      assert.deepStrictEqual(inspect(parser('# ')), undefined);
      assert.deepStrictEqual(inspect(parser('#\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#a\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#a \n')), undefined);
      assert.deepStrictEqual(inspect(parser('#a\n#')), undefined);
      assert.deepStrictEqual(inspect(parser('#a\\\n#')), undefined);
      assert.deepStrictEqual(inspect(parser('# a\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('# *a\nb*')), undefined);
      assert.deepStrictEqual(inspect(parser('# !http://host')), undefined);
      assert.deepStrictEqual(inspect(parser('####### a')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a ')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a b  c \n')), [['<h1 id="index:a-b-c">a b  c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# *a*`b`${c}$')), [['<h1 id="index:a`b`${c}$"><em>a</em><code data-src="`b`">b</code><span class="math notranslate" data-src="${c}$">${c}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\\n')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6 id="index:a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## b')), [['<h1 id="index:a">a</h1>', '<h2 id="index:b">b</h2>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser('# [#a]')), [['<h1 id="index:a"><a href="#index:a" rel="noopener" class="index">a</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[#b]')), [['<h1 id="index:ab">a<a href="#index:b" rel="noopener" class="index">b</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]')), [['<h1 id="index:b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] ')), [['<h1 id="index:b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]\\')), [['<h1 id="index:a-b">a <a href="#index:b" rel="noopener" class="index">b</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b c]')), [['<h1 id="index:b-c">a<span class="indexer" data-index="b-c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#*b*`c`${d}$]')), [['<h1 id="index:b`c`${d}$">a<span class="indexer" data-index="b`c`${d}$"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] [#c]')), [['<h1 id="index:c">a <a href="#index:b" rel="noopener" class="index">b</a><span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a  [#b] \n')), [['<h1 id="index:b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \\[#b]')), [['<h1 id="index:a-[#b]">a [<a class="hashtag" rel="noopener">#b</a>]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A')), [['<h1 id="index:A">A</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# *A*')), [['<h1 id="index:A"><em>A</em></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# `A`')), [['<h1 id="index:`A`"><code data-src="`A`">A</code></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# ${A}$')), [['<h1 id="index:${A}$"><span class="math notranslate" data-src="${A}$">${A}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#B]')), [['<h1 id="index:B">A<span class="indexer" data-index="B"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#`B`]')), [['<h1 id="index:`B`">A<span class="indexer" data-index="`B`"></span></h1>'], '']);
    });

  });

});
