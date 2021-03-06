import { heading, segment } from './heading';
import { eval, exec } from '../../combinator/data/parser';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = (source: string) => {
      const result = segment(source, {});
      return result
        ? [eval(result).flatMap(seg => eval<HTMLElement | string>(heading(seg, {}), [seg])), exec(result)] as const
        : some(heading)(source, {});
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
      assert.deepStrictEqual(inspect(parser('####### a')), undefined);
      assert.deepStrictEqual(inspect(parser(' # a')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a ')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a b  c \n')), [['<h1 id="index:a_b_c">a b  c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# *a*`b`${c}$')), [['<h1 id="index:a`b`${c}$"><em>a</em><code data-src="`b`">b</code><span class="math notranslate" data-src="${c}$">${c}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\\\n')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# \\')), [['<h1 id="index:\\">\\</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## \\')), [['<h2 id="index:\\">\\</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# @a')), [['<h1 id="index:@a">@a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## @a')), [['<h2 id="index:@a"><a class="account" href="/@a">@a</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# http://host')), [['<h1 id="index:http://host">http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## http://host')), [['<h2 id="index:http://host"><a href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# !http://host')), [['<h1 id="index:!http://host">!http://host</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## !http://host')), [['<h2 id="index:!http://host">!<a href="http://host" target="_blank">http://host</a></h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a((b))')), [['<h1 id="index:a((b))">a((b))</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a((b))')), [['<h2 id="index:a((b))">a((b))</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[[b]]')), [['<h1 id="index:a[[b]]">a[[b]]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a[[b]]')), [['<h2 id="index:a[[b]]">a[[b]]</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6 id="index:a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n##')), [['<h1 id="index:a">a</h1>', '##'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## ')), [['<h1 id="index:a">a</h1>', '## '], '']);
      assert.deepStrictEqual(inspect(parser('# a\n## b')), [['<h1 id="index:a">a</h1>', '<h2 id="index:b">b</h2>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n##\n## b')), [['<h1 id="index:a">a</h1>', '##\n', '<h2 id="index:b">b</h2>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('# [#a]')), [['<h1 id="index:[#a]">[#a]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[#b]')), [['<h1 id="index:a[#b]">a[#b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]')), [['<h1 id="index:b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] ')), [['<h1 id="index:b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]\\')), [['<h1 id="index:a_[#b]">a [#b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b c]')), [['<h1 id="index:b_c">a<span class="indexer" data-index="b_c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#*b*`c`${d}$]')), [['<h1 id="index:b`c`${d}$">a<span class="indexer" data-index="b`c`${d}$"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] [#c]')), [['<h1 id="index:c">a [#b]<span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a  [#b] \n')), [['<h1 id="index:b">a<span class="indexer" data-index="b"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \\[#b]')), [['<h1 id="index:a_[#b]">a [#b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A')), [['<h1 id="index:A">A</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# *A*')), [['<h1 id="index:A"><em>A</em></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# `A`')), [['<h1 id="index:`A`"><code data-src="`A`">A</code></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# ${A}$')), [['<h1 id="index:${A}$"><span class="math notranslate" data-src="${A}$">${A}$</span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#B]')), [['<h1 id="index:B">A<span class="indexer" data-index="B"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#`B`]')), [['<h1 id="index:`B`">A<span class="indexer" data-index="`B`"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#@a]')), [['<h1 id="index:@a">A<span class="indexer" data-index="@a"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#http://host]')), [['<h1 id="index:http://host">A<span class="indexer" data-index="http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#!http://host]')), [['<h1 id="index:!http://host">A<span class="indexer" data-index="!http://host"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#a((b))]')), [['<h1 id="index:a((b))">A<span class="indexer" data-index="a((b))"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#a[[b]]]')), [['<h1 id="index:a[[b]]">A<span class="indexer" data-index="a[[b]]"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# A [#b|#c]')), [['<h1 id="index:c">A<span class="indexer" data-index="c"></span></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('## a [#b] [#c]')), [['<h2 id="index:c">a [<a class="hashtag" href="/hashtags/b">#b</a>]<span class="indexer" data-index="c"></span></h2>'], '']);
    });

  });

});
