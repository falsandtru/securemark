import { heading } from './heading';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = some(heading);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a \n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a\n#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a\\\n#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# \n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# a\nb')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# *a\nb*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# a\n#b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('####### a')), [['<h6 class="invalid" id="index::#######_a">####### a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' # a')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('# a')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a ')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a b  c \n')), [['<h1 id="index::a_b_c">a b c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a\n')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# *a*`b`${c}$')), [['<h1 id="index::a`b`${c}$"><em>a</em><code data-src="`b`">b</code><span class="math" translate="no" data-src="${c}$">${c}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a\\')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a\\\n')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# \\')), [['<h1 id="index::\\">\\</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# \\ a')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## \\')), [['<h2 id="index::\\">\\</h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# @a')), [['<h1 id="index::@a">@a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## @a')), [['<h2 id="index::@a"><a class="account" href="/@a">@a</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# http://host')), [['<h1 id="index::http://host">http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## http://host')), [['<h2 id="index::http://host"><a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# !http://host')), [['<h1 id="index::!http://host">!http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## !http://host')), [['<h2 id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a((b))')), [['<h1 id="index::a((b))">a<span class="paren">(<span class="paren">(b)</span>)</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## a((b))')), [['<h2 id="index::a((b))">a<span class="paren">(<span class="paren">(b)</span>)</span></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a[[b]]')), [['<h1 id="index::a[[b]]">a[[b]]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## a[[b]]')), [['<h2 id="index::a[[b]]">a[[b]]</h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('###### a')), [['<h6 id="index::a">a</h6>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('# [|a]')), [['<h1 id="index::[|a]"><span class="invalid">[|a]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a[|b]')), [['<h1 id="index::a[|b]">a<span class="invalid">[|b]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b]')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b] ')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b]\\')), [['<h1 id="index::a_[|b]">a <span class="invalid">[|b]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|B]')), [['<h1 id="index::B">a<span class="indexer" data-index="B"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b ]')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b  ]')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b c]')), [['<h1 id="index::b_c">a<span class="indexer" data-index="b_c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|*b*\\`c\\`\\$\\{d\\}\\$]')), [['<h1 id="index::*b*`c`${d}$">a<span class="indexer" data-index="*b*`c`${d}$"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|@a]')), [['<h1 id="index::@a">a<span class="indexer" data-index="@a"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|http://host]')), [['<h1 id="index::http://host">a<span class="indexer" data-index="http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|!http://host]')), [['<h1 id="index::!http://host">a<span class="indexer" data-index="!http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|a\\(\\(b\\)\\)]')), [['<h1 id="index::a((b))">a<span class="indexer" data-index="a((b))"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|a\\[\\[b\\]\\]]')), [['<h1 id="index::a[[b]]">a<span class="indexer" data-index="a[[b]]"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b] [|c]')), [['<h1 id="index::c">a <span class="invalid">[|b]</span><span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a  [|b] \n')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a \\[|b]')), [['<h1 id="index::a_[|b]">a [|b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# - [|b]')), [['<h1 id="index::b">-<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## a [|b] [|c]')), [['<h2 id="index::c">a <span class="invalid">[|b]</span><span class="indexer" data-index="c"></span></h2>'], '']);
    });

  });

});
