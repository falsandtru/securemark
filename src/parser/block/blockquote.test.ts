import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = (source: string) => some(blockquote)(source, {});

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
      assert.deepStrictEqual(inspect(parser('> a\n>>1')), [['<blockquote><pre>a<br><a class="anchor" href="?res=1" rel="noopener">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>>1')), [['<blockquote><pre>a<br><br><a class="anchor" href="?res=1" rel="noopener">&gt;&gt;1</a></pre></blockquote>'], '']);
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
      assert.deepStrictEqual(inspect(parser('> #a')), [['<blockquote><pre><a class="hashtag" href="/hashtags/a" rel="noopener">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> @a#b')), [['<blockquote><pre><a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b')), [['<blockquote><pre><a class="anchor" href="?res=1" rel="noopener">&gt;&gt;1</a><br>&gt; b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b\n> c')), [['<blockquote><pre><a class="anchor" href="?res=1" rel="noopener">&gt;&gt;1</a><br>&gt; b<br>c</pre></blockquote>'], '']);
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
      assert.deepStrictEqual(inspect(parser('!> \\')), [['<blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n')), [['<blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a')), [['<blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n')), [['<blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb')), [['<blockquote><p>a<span class="linebreak"> </span>b</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\nb*')), [['<blockquote><p><em>a<br>b</em></p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\n> b*')), [['<blockquote><p><em>a<br>b</em></p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c ')), [['<blockquote><p>a<br> b  c</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a')), [['<blockquote><blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b')), [['<blockquote><blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote><p>b</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a')), [['<blockquote><ul><li>a</li></ul><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```')), [['<blockquote><pre class="notranslate">a</pre><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```')), [['<blockquote><pre class="notranslate">a</pre><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```')), [['<blockquote><pre class="notranslate">a</pre><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><pre class="notranslate">a<br><br>b</pre><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b')), [['<blockquote><p>a</p><p>b</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><blockquote><pre>a</pre></blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><blockquote><pre>a<br>b</pre></blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><blockquote><pre>a<br>b</pre></blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><blockquote><pre>a</pre></blockquote><ol class="annotation"></ol><ol class="reference"></ol><blockquote><p>b</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><blockquote><pre>a</pre></blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote><p>b</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> !> a')), [['<blockquote><blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \na')), [['<blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('!>\na')), [['<blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n a')), [['<blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n>')), [['<blockquote><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n> a')), [['<blockquote><p>a</p><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ## a\n> ## a')), [['<blockquote><blockquote><h2>a</h2><ol class="annotation"></ol><ol class="reference"></ol></blockquote><h2>a</h2><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~ a\n> ~ a')), [['<blockquote><blockquote><dl><dt>a</dt><dd></dd></dl><ol class="annotation"></ol><ol class="reference"></ol></blockquote><dl><dt>a</dt><dd></dd></dl><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~~~figure $fig-a\n>> > \n>>\n~~~\n> ~~~figure $fig-a\n> > \n>\n[#a]\n~~~')), [['<blockquote><blockquote><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig 1. </span><figcaption></figcaption></figure><ol class="annotation"></ol><ol class="reference"></ol></blockquote><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig 1. </span><figcaption><a class="index">a</a></figcaption></figure><ol class="annotation"></ol><ol class="reference"></ol></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ((a))\n> ((a))')), [['<blockquote><blockquote><p><sup class="annotation disabled" title="a"><a rel="noopener">*1</a></sup></p><ol class="annotation"><li>a<sup><a rel="noopener">~1</a></sup></li></ol><ol class="reference"></ol></blockquote><p><sup class="annotation disabled" title="a"><a rel="noopener">*1</a></sup></p><ol class="annotation"><li>a<sup><a rel="noopener">~1</a></sup></li></ol><ol class="reference"></ol></blockquote>'], '']);
    });

  });

});
