import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = (source: string) => some(blockquote)({ source, context: {} });

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
      assert.deepStrictEqual(inspect(parser('> a\n>>1')), [['<blockquote><pre>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>>1')), [['<blockquote><pre>a<br><br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b ')), [['<blockquote><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb')), [['<blockquote><pre>a\\<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a ')), [['<blockquote><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a')), [['<blockquote><pre><br> a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<blockquote><pre><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> http://host')), [['<blockquote><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> !http://host')), [['<blockquote><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> #a')), [['<blockquote><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> @a#b')), [['<blockquote><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b')), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b\n> c')), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b<br>c</pre></blockquote>'], '']);
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
      assert.deepStrictEqual(inspect(parser('!> \\')), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n')), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb')), [['<blockquote><section><p>a<br>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ++a\nb++')), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ++a\n> b++')), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c ')), [['<blockquote><section><p> a<br> b  c</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a')), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b')), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a')), [['<blockquote><section><ul><li>a</li></ul><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```')), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```')), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```')), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><section><pre class="text">a<br><br>b</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b')), [['<blockquote><section><p>a</p><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section><blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> !> a')), [['<blockquote><section><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \na')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('!>\na')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n a')), [['<blockquote><section><p> a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n>')), [['<blockquote><section><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n> a')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ## a\n> ## a')), [['<blockquote><blockquote><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></blockquote><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~ a\n> ~ a')), [['<blockquote><blockquote><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~~~figure $test-a\n>> > \n>>\n~~~\n> ~~~figure $test-a\n> > \n>\n[#a]\n~~~')), [['<blockquote><blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"><a class="index">a</a></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ((a))\n> ((a))')), [['<blockquote><blockquote><section><p><sup class="annotation disabled" title="a"><span hidden="">a</span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1">a<sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote><section><p><sup class="annotation disabled" title="a"><span hidden="">a</span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1">a<sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
    });

  });

});
