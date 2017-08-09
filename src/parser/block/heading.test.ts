import { loop } from '../../combinator/loop';
import { heading } from './heading';
import { inspect } from '../debug.test';

describe('Unit: parser/block/heading', () => {
  describe('heading', () => {
    const parser = loop(heading);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('#')), void 0);
      assert.deepStrictEqual(inspect(parser('# ')), void 0);
      assert.deepStrictEqual(inspect(parser('#\n')), void 0);
      assert.deepStrictEqual(inspect(parser('#a\n')), void 0);
      assert.deepStrictEqual(inspect(parser('#a \n')), void 0);
      assert.deepStrictEqual(inspect(parser('#a\n#')), void 0);
      assert.deepStrictEqual(inspect(parser('# a []\n()')), void 0);
      assert.deepStrictEqual(inspect(parser('####### a')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a ')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1 id="index:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a b  c \n')), [['<h1 id="index:a-b-c">a b  c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n#')), [['<h1 id="index:a">a</h1>'], '#']);
      assert.deepStrictEqual(inspect(parser('# a\n\n# b')), [['<h1 id="index:a">a</h1>', '<h1 id="index:b">b</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n\n# b')), [['<h1 id="index:a">a</h1>'], '\n# b']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6 id="index:a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[#b]')), [['<h1 id="index:ab">a<a href="#index:b" rel="noopener">b</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]')), [['<h1 id="index:b">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] ')), [['<h1 id="index:b">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]\\')), [['<h1 id="index:a-b">a <a href="#index:b" rel="noopener">b</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b c]')), [['<h1 id="index:a-b-c">a <a href="#index:b-c" rel="noopener">b c</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] [#c]')), [['<h1 id="index:c">a <a href="#index:b" rel="noopener">b</a></h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a  [#b] \n')), [['<h1 id="index:b">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \\[#b]')), [['<h1 id="index:a-[#b]">a [#b]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# `a`$b$')), [['<h1 id="index:`a`$b$"><code data-src="`a`">a</code><span class="math" data-src="$b$">$b$</span></h1>'], '']);
    });

  });

});
