import { heading, segment } from './heading';
import { input, eval, exec } from '../../combinator/data/parser';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = (source: string) => {
      const result = segment(input(source, {}));
      return result
        ? [eval(result).flatMap(seg => eval<HTMLElement | string>(heading(input(seg, {})), [seg])), exec(result)] as const
        : some(heading)(input(source, {}));
    };

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), undefined);
      assert.deepStrictEqual(inspect(parser('#\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#a\n')), undefined);
      assert.deepStrictEqual(inspect(parser('#a \n')), undefined);
      assert.deepStrictEqual(inspect(parser('#a\n#')), undefined);
      assert.deepStrictEqual(inspect(parser('#a\\\n#')), undefined);
      assert.deepStrictEqual(inspect(parser('# ')), undefined);
      assert.deepStrictEqual(inspect(parser('#\n')), undefined);
      assert.deepStrictEqual(inspect(parser('# \n')), undefined);
      assert.deepStrictEqual(inspect(parser('# a\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('# *a\nb*')), undefined);
      assert.deepStrictEqual(inspect(parser('# a\n#b')), undefined);
      assert.deepStrictEqual(inspect(parser('####### a')), [['<h6 class="invalid" id="index::a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser(' # a')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a ')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a b  c \n')), [['<h1 id="index::a_b__c">a b  c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# *a*`b`${c}$')), [['<h1 id="index::a`b`${c}$"><em>a</em><code data-src="`b`">b</code><span class="math" translate="no" data-src="${c}$">${c}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\\n')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# \\')), [['<h1 id="index::\\">\\</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# \\ a')), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## \\')), [['<h2 id="index::\\">\\</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# @a')), [['<h1 id="index::@a">@a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## @a')), [['<h2 id="index::@a"><a class="account" href="/@a">@a</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# http://host')), [['<h1 id="index::http://host">http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## http://host')), [['<h2 id="index::http://host"><a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# !http://host')), [['<h1 id="index::!http://host">!http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## !http://host')), [['<h2 id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a((b))')), [['<h1 id="index::a((b))">a<span class="paren">((b))</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a((b))')), [['<h2 id="index::a((b))">a<span class="paren">((b))</span></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[[b]]')), [['<h1 id="index::a[[b]]">a[[b]]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a[[b]]')), [['<h2 id="index::a[[b]]">a[[b]]</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6 id="index::a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n##')), [['<h1 id="index::a">a</h1>', '##'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## ')), [['<h1 id="index::a">a</h1>', '## '], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## b')), [['<h1 id="index::a">a</h1>', '<h2 id="index::b">b</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n##\n## b')), [['<h1 id="index::a">a</h1>', '##\n', '<h2 id="index::b">b</h2>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('# [|a]')), [['<h1 id="index::a"><span class="invalid">a</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[|b]')), [['<h1 id="index::ab">a<span class="invalid">b</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b]')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b] ')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b]\\')), [['<h1 id="index::a_b">a <span class="invalid">b</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|B]')), [['<h1 id="index::B">a<span class="indexer" data-index="B"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b ]')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b  ]')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b c]')), [['<h1 id="index::b_c">a<span class="indexer" data-index="b_c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|*b*`c`${d}$]')), [['<h1 id="index::*b*`c`${d}$">a<span class="indexer" data-index="*b*`c`${d}$"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|@a]')), [['<h1 id="index::@a">a<span class="indexer" data-index="@a"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|http://host]')), [['<h1 id="index::http://host">a<span class="indexer" data-index="http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|!http://host]')), [['<h1 id="index::!http://host">a<span class="indexer" data-index="!http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|a((b))]')), [['<h1 id="index::a((b))">a<span class="indexer" data-index="a((b))"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|a[[b]]]')), [['<h1 id="index::a[[b]]">a<span class="indexer" data-index="a[[b]]"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b] [|c]')), [['<h1 id="index::c">a <span class="invalid">b</span><span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a  [|b] \n')), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \\[|b]')), [['<h1 id="index::a_[|b]">a [|b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a [|b] [|c]')), [['<h2 id="index::c">a <span class="invalid">b</span><span class="indexer" data-index="c"></span></h2>'], '']);
    });

  });

});
