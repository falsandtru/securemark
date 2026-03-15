import { heading } from './heading';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = some(heading);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a \n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a\n#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a\\\n#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# \n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# a\nb', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# *a\nb*', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# a\n#b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('####### a', new Context())), [['<h6 class="invalid" id="index::#######_a">####### a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' # a', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('# a', new Context())), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a ', new Context())), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a b  c \n', new Context())), [['<h1 id="index::a_b_c">a b c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a\n', new Context())), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# *a*`b`${c}$', new Context())), [['<h1 id="index::a`b`${c}$"><em>a</em><code data-src="`b`">b</code><span class="math" translate="no" data-src="${c}$">${c}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a\\', new Context())), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a\\\n', new Context())), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# \\', new Context())), [['<h1 id="index::\\">\\</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# \\ a', new Context())), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## \\', new Context())), [['<h2 id="index::\\">\\</h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# @a', new Context())), [['<h1 id="index::@a">@a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## @a', new Context())), [['<h2 id="index::@a"><a class="account" href="/@a">@a</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# http://host', new Context())), [['<h1 id="index::http://host">http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## http://host', new Context())), [['<h2 id="index::http://host"><a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# !http://host', new Context())), [['<h1 id="index::!http://host">!http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## !http://host', new Context())), [['<h2 id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a((b))', new Context())), [['<h1 id="index::a((b))">a<span class="bracket">((b))</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## a((b))', new Context())), [['<h2 id="index::a((b))">a<span class="bracket">((b))</span></h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a[[b]]', new Context())), [['<h1 id="index::a[[b]]">a[[b]]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## a[[b]]', new Context())), [['<h2 id="index::a[[b]]">a[[b]]</h2>'], '']);
      assert.deepStrictEqual(inspect(parser, input('###### a', new Context())), [['<h6 id="index::a">a</h6>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('# [|a]', new Context())), [['<h1 id="index::[|a]"><span class="invalid">[|a]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a[|b]', new Context())), [['<h1 id="index::a[|b]">a<span class="invalid">[|b]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b]', new Context())), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b] ', new Context())), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b]\\', new Context())), [['<h1 id="index::a_[|b]">a <span class="invalid">[|b]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|B]', new Context())), [['<h1 id="index::B">a<span class="indexer" data-index="B"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b ]', new Context())), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b  ]', new Context())), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b c]', new Context())), [['<h1 id="index::b_c">a<span class="indexer" data-index="b_c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|*b*\\`c\\`\\$\\{d\\}\\$]', new Context())), [['<h1 id="index::*b*`c`${d}$">a<span class="indexer" data-index="*b*`c`${d}$"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|@a]', new Context())), [['<h1 id="index::@a">a<span class="indexer" data-index="@a"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|http://host]', new Context())), [['<h1 id="index::http://host">a<span class="indexer" data-index="http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|!http://host]', new Context())), [['<h1 id="index::!http://host">a<span class="indexer" data-index="!http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|a\\(\\(b\\)\\)]', new Context())), [['<h1 id="index::a((b))">a<span class="indexer" data-index="a((b))"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|a\\[\\[b\\]\\]]', new Context())), [['<h1 id="index::a[[b]]">a<span class="indexer" data-index="a[[b]]"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a [|b] [|c]', new Context())), [['<h1 id="index::c">a <span class="invalid">[|b]</span><span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a  [|b] \n', new Context())), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# a \\[|b]', new Context())), [['<h1 id="index::a_[|b]">a [|b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('# - [|b]', new Context())), [['<h1 id="index::b">-<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser, input('## a [|b] [|c]', new Context())), [['<h2 id="index::c">a <span class="invalid">[|b]</span><span class="indexer" data-index="c"></span></h2>'], '']);
    });

  });

});
