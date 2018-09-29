import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = some(blockquote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>a')), undefined);
      assert.deepStrictEqual(inspect(parser('>\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' >')), undefined);
      assert.deepStrictEqual(inspect(parser(' >a')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\')), [['<blockquote><pre class="quote">\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\\n')), [['<blockquote><pre class="quote">\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<blockquote><pre class="quote">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<blockquote><pre class="quote">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb')), [['<blockquote><pre class="quote">a\nb</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n b ')), [['<blockquote><pre class="quote">a\n b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>')), [['<blockquote><pre class="quote">a\n</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>b')), [['<blockquote><pre class="quote">a\n&gt;b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote><pre class="quote">a\nb </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote><pre class="quote">a\n</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote><pre class="quote">a\n\nb</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote><pre class="quote">a\n\n b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote><pre class="quote">a\n\n</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>b')), [['<blockquote><pre class="quote">a\n\n&gt;b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b ')), [['<blockquote><pre class="quote">a\n\nb </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb')), [['<blockquote><pre class="quote">a\\\nb</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a ')), [['<blockquote><pre class="quote"> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na')), [['<blockquote><pre class="quote">\na</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<blockquote><pre class="quote">\na</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a')), [['<blockquote><pre class="quote">\n a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<blockquote><pre class="quote">\n</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a')), [['<blockquote><pre class="quote">\na</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('> a\n>>')), [['<blockquote><pre class="quote">a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n> c')), [['<blockquote><pre class="quote">a</pre><blockquote><pre class="quote">b</pre></blockquote><pre class="quote">c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>> c')), [['<blockquote><pre class="quote">a</pre><blockquote><pre class="quote">b\nc</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>>> c')), [['<blockquote><pre class="quote">a</pre><blockquote><pre class="quote">b</pre><blockquote><pre class="quote">c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a')), [['<blockquote><blockquote><pre class="quote">a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>')), [['<blockquote><blockquote><pre class="quote">a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b')), [['<blockquote><blockquote><pre class="quote">a</pre></blockquote><pre class="quote">b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>> b\n> c')), [['<blockquote><blockquote><pre class="quote">a</pre><blockquote><pre class="quote">b</pre></blockquote></blockquote><pre class="quote">c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b\n>>> c')), [['<blockquote><blockquote><pre class="quote">a</pre></blockquote><pre class="quote">b</pre><blockquote><blockquote><pre class="quote">c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>>> a\n>> b\n> c')), [['<blockquote><blockquote><blockquote><pre class="quote">a</pre></blockquote><pre class="quote">b</pre></blockquote><pre class="quote">c</pre></blockquote>'], '']);
    });

    it('markdown', () => {
      assert.deepStrictEqual(inspect(parser('!')), undefined);
      assert.deepStrictEqual(inspect(parser('!>')), undefined);
      assert.deepStrictEqual(inspect(parser('!> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb')), [['<blockquote><p>a<br>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\nb*')), [['<blockquote><p><em>a<span class="linebreak"> </span>b</em></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\n> b*')), [['<blockquote><p><em>a<span class="linebreak"> </span>b</em></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c ')), [['<blockquote><p>a <span class="linebreak"> </span> b  c</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b')), [['<blockquote><blockquote><p>a</p></blockquote><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a')), [['<blockquote><ul><li>a</li></ul></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><pre class="notranslate">a\n\nb</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b')), [['<blockquote><p>a</p><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><blockquote><pre class="quote">a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><blockquote><pre class="quote">a\nb</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><blockquote><pre class="quote">a\nb</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><blockquote><pre class="quote">a</pre></blockquote><blockquote><p>b</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><blockquote><pre class="quote">a</pre></blockquote></blockquote><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> !> a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \na')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('!>\na')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n a')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n>')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n> a')), [['<blockquote><p>a</p></blockquote>'], '']);
    });

  });

});
