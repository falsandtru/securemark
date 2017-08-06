import { loop } from '../../combinator/loop';
import { heading } from './heading';
import { inspect } from '../debug.test';

describe('Unit: parser/heading', () => {
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
      assert.deepStrictEqual(inspect(parser('# a')), [['<h1 id="section:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a ')), [['<h1 id="section:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n')), [['<h1 id="section:a">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a b  c \n')), [['<h1 id="section:a-b-c">a b  c</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n#')), [['<h1 id="section:a">a</h1>'], '#']);
      assert.deepStrictEqual(inspect(parser('# a\n\n# b')), [['<h1 id="section:a">a</h1>', '<h1 id="section:b">b</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a\n\n\n# b')), [['<h1 id="section:a">a</h1>'], '\n# b']);
      assert.deepStrictEqual(inspect(parser('###### a')), [['<h6 id="section:a">a</h6>'], '']);
      assert.deepStrictEqual(inspect(parser('# a[#b]')), [['<h1 id="section:a[b]">a[<a href="#section:b" rel="noopener">b</a>]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b]')), [['<h1 id="section:b">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] ')), [['<h1 id="section:b">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b c]')), [['<h1 id="section:a-[b-c]">a [<a href="#section:b" rel="noopener">b</a> c]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a [#b] [#c]')), [['<h1 id="section:c">a [<a href="#section:b" rel="noopener">b</a>]</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a  [#b] \n')), [['<h1 id="section:b">a</h1>'], '']);
      assert.deepStrictEqual(inspect(parser('# a \\[#b]')), [['<h1 id="section:a-[b]">a [<a href="#section:b" rel="noopener">b</a>]</h1>'], '']);
    });

  });

});
