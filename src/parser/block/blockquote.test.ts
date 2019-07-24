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
      assert.deepStrictEqual(inspect(parser('> \\')), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\\n')), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb')), [['<blockquote><pre>a<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n b ')), [['<blockquote><pre>a<br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>b')), [['<blockquote><pre>a<br>&gt;b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>b')), [['<blockquote><pre>a<br><br>&gt;b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b ')), [['<blockquote><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb')), [['<blockquote><pre>a\\<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a ')), [['<blockquote><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a')), [['<blockquote><pre><br> a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<blockquote><pre><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> http://host')), [['<blockquote><pre><a href="http://host" rel="noopener" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> !http://host')), [['<blockquote><pre>!<a href="http://host" rel="noopener" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> #a')), [['<blockquote><pre><a class="hashtag" rel="noopener">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> @a#b')), [['<blockquote><pre><a class="channel" rel="noopener">@a#b</a></pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('> a\n>>')), [['<blockquote><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n> c')), [['<blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>> c')), [['<blockquote><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>>> c')), [['<blockquote><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a')), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>')), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b')), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>> b\n> c')), [['<blockquote><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b\n>>> c')), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>>> a\n>> b\n> c')), [['<blockquote><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

    it('markdown', () => {
      assert.deepStrictEqual(inspect(parser('!')), undefined);
      assert.deepStrictEqual(inspect(parser('!>')), undefined);
      assert.deepStrictEqual(inspect(parser('!> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb')), [['<blockquote><p>a<span class="linebreak"> </span>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\nb*')), [['<blockquote><p><em>a<br>b</em></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\n> b*')), [['<blockquote><p><em>a<br>b</em></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c ')), [['<blockquote><p>a<br> b  c</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b')), [['<blockquote><blockquote><p>a</p></blockquote><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a')), [['<blockquote><ul><li>a</li></ul></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><pre class="notranslate">a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b')), [['<blockquote><p>a</p><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><blockquote><pre>a<br>b</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><blockquote><pre>a<br>b</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><blockquote><pre>a</pre></blockquote><blockquote><p>b</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><blockquote><pre>a</pre></blockquote></blockquote><p>b</p></blockquote>'], '']);
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
