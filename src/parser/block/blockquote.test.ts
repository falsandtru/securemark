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
      assert.deepStrictEqual(inspect(parser(' > ')), undefined);
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
      assert.deepStrictEqual(inspect(parser('> a\n>>1')), [['<blockquote><pre>a<br><a href="?at=1" class="anchor">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>>1')), [['<blockquote><pre>a<br><br><a href="?at=1" class="anchor">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b ')), [['<blockquote><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb')), [['<blockquote><pre>a\\<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a ')), [['<blockquote><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a')), [['<blockquote><pre><br> a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<blockquote><pre><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> http://host')), [['<blockquote><pre><a href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> !http://host')), [['<blockquote><pre>!<a href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> #a')), [['<blockquote><pre><a href="/hashtags/a" class="hashtag">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> @a#b')), [['<blockquote><pre><a href="/@a?ch=b" class="channel">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b')), [['<blockquote><pre><a href="?at=1" class="anchor">&gt;&gt;1</a><br>&gt; b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b\n> c')), [['<blockquote><pre><a href="?at=1" class="anchor">&gt;&gt;1</a><br>&gt; b<br>c</pre></blockquote>'], '']);
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
      assert.deepStrictEqual(inspect(parser('!> \\')), [['<blockquote><section><p>\\</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n')), [['<blockquote><section><p>\\</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a')), [['<blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n')), [['<blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb')), [['<blockquote><section><p>a<span class="linebreak"> </span>b</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\nb*')), [['<blockquote><section><p><em>a<br>b</em></p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\n> b*')), [['<blockquote><section><p><em>a<br>b</em></p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c ')), [['<blockquote><section><p>a<br> b  c</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a')), [['<blockquote><blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b')), [['<blockquote><blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><section><p>b</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a')), [['<blockquote><section><ul><li>a</li></ul><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```')), [['<blockquote><section><pre class="text" translate="no">a</pre><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```')), [['<blockquote><section><pre class="text" translate="no">a</pre><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```')), [['<blockquote><section><pre class="text" translate="no">a</pre><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><section><pre class="text" translate="no">a<br><br>b</pre><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b')), [['<blockquote><section><p>a</p><p>b</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><section><blockquote><pre>a</pre></blockquote><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><section><blockquote><pre>a</pre></blockquote><ol class="annotations"></ol><ol class="references"></ol></section><blockquote><section><p>b</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><section><blockquote><pre>a</pre></blockquote><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><section><p>b</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> !> a')), [['<blockquote><section><blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \na')), [['<blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('!>\na')), [['<blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n a')), [['<blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n>')), [['<blockquote><section><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n> a')), [['<blockquote><section><p>a</p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ## a\n> ## a')), [['<blockquote><blockquote><section><h2>a</h2><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><section><h2>a</h2><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~ a\n> ~ a')), [['<blockquote><blockquote><section><dl><dt>a</dt><dd></dd></dl><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><section><dl><dt>a</dt><dd></dd></dl><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~~~figure $fig-a\n>> > \n>>\n~~~\n> ~~~figure $fig-a\n> > \n>\n[#a]\n~~~')), [['<blockquote><blockquote><section><figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1"><figcaption><span class="figindex">Fig. 1. </span></figcaption><div><blockquote></blockquote></div></figure><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1"><figcaption><span class="figindex">Fig. 1. </span><a class="index">a</a></figcaption><div><blockquote></blockquote></div></figure><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ((a))\n> ((a))')), [['<blockquote><blockquote><section><p><sup class="annotation disabled" title="a"><span hidden="">a</span><a>*1</a></sup></p><ol class="annotations"><li>a<sup><a>^1</a></sup></li></ol><ol class="references"></ol></section></blockquote><section><p><sup class="annotation disabled" title="a"><span hidden="">a</span><a>*1</a></sup></p><ol class="annotations"><li>a<sup><a>^1</a></sup></li></ol><ol class="references"></ol></section></blockquote>'], '']);
    });

  });

});
