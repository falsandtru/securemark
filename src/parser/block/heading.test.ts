import { heading, segment } from './heading';
import { input, eval } from '../../combinator/data/parser';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = (source: string) => {
      const result = segment(input(source, ctx));
      return result
        ? [eval(result).flatMap(seg => eval<HTMLElement | string>(heading(input(seg, {})), [seg]))] as const
        : some(heading)(input(source, ctx));
    };
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a \n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a\n#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a\\\n#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('# '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('# \n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('# a\nb'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('# *a\nb*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('# a\n#b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('####### a'), ctx), [['<h6 class="invalid" id="index::#######_a">####### a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser(' # a'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('# a'), ctx), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a '), ctx), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a b  c \n'), ctx), [['<h1 id="index::a_b__c">a b  c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n'), ctx), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# *a*`b`${c}$'), ctx), [['<h1 id="index::a`b`${c}$"><em>a</em><code data-src="`b`">b</code><span class="math" translate="no" data-src="${c}$">${c}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\'), ctx), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\\n'), ctx), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# \\'), ctx), [['<h1 id="index::\\">\\</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# \\ a'), ctx), [['<h1 id="index::a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## \\'), ctx), [['<h2 id="index::\\">\\</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# @a'), ctx), [['<h1 id="index::@a">@a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## @a'), ctx), [['<h2 id="index::@a"><a class="account" href="/@a">@a</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# http://host'), ctx), [['<h1 id="index::http://host">http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## http://host'), ctx), [['<h2 id="index::http://host"><a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# !http://host'), ctx), [['<h1 id="index::!http://host">!http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## !http://host'), ctx), [['<h2 id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a((b))'), ctx), [['<h1 id="index::a((b))">a<span class="paren">((b))</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a((b))'), ctx), [['<h2 id="index::a((b))">a<span class="paren">((b))</span></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[[b]]'), ctx), [['<h1 id="index::a[[b]]">a[[b]]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a[[b]]'), ctx), [['<h2 id="index::a[[b]]">a[[b]]</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('###### a'), ctx), [['<h6 id="index::a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n##'), ctx), [['<h1 id="index::a">a</h1>', '##'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## '), ctx), [['<h1 id="index::a">a</h1>', '## '], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## b'), ctx), [['<h1 id="index::a">a</h1>', '<h2 id="index::b">b</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n##\n## b'), ctx), [['<h1 id="index::a">a</h1>', '##\n', '<h2 id="index::b">b</h2>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('# [|a]'), ctx), [['<h1 id="index::[|a]"><span class="invalid">[|a]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[|b]'), ctx), [['<h1 id="index::a[|b]">a<span class="invalid">[|b]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b]'), ctx), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b] '), ctx), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b]\\'), ctx), [['<h1 id="index::a_[|b]">a <span class="invalid">[|b]</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|B]'), ctx), [['<h1 id="index::B">a<span class="indexer" data-index="B"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b ]'), ctx), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b  ]'), ctx), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b c]'), ctx), [['<h1 id="index::b_c">a<span class="indexer" data-index="b_c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|*b*`c`${d}$]'), ctx), [['<h1 id="index::*b*`c`${d}$">a<span class="indexer" data-index="*b*`c`${d}$"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|@a]'), ctx), [['<h1 id="index::@a">a<span class="indexer" data-index="@a"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|http://host]'), ctx), [['<h1 id="index::http://host">a<span class="indexer" data-index="http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|!http://host]'), ctx), [['<h1 id="index::!http://host">a<span class="indexer" data-index="!http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|a((b))]'), ctx), [['<h1 id="index::a((b))">a<span class="indexer" data-index="a((b))"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|a[[b]]]'), ctx), [['<h1 id="index::a[[b]]">a<span class="indexer" data-index="a[[b]]"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [|b] [|c]'), ctx), [['<h1 id="index::c">a <span class="invalid">[|b]</span><span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a  [|b] \n'), ctx), [['<h1 id="index::b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \\[|b]'), ctx), [['<h1 id="index::a_[|b]">a [|b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a [|b] [|c]'), ctx), [['<h2 id="index::c">a <span class="invalid">[|b]</span><span class="indexer" data-index="c"></span></h2>'], '']);
    });

  });

});
