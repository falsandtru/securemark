import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = (source: string) => some(blockquote)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' > '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('> '), ctx), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\'), ctx), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\\n'), ctx), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a'), ctx), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n'), ctx), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb'), ctx), [['<blockquote><pre>a<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n b '), ctx), [['<blockquote><pre>a<br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>'), ctx), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>>1'), ctx), [['<blockquote><pre>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b '), ctx), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n'), ctx), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb'), ctx), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b '), ctx), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>'), ctx), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>>1'), ctx), [['<blockquote><pre>a<br><br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b '), ctx), [['<blockquote><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb'), ctx), [['<blockquote><pre>a\\<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a '), ctx), [['<blockquote><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na'), ctx), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na'), ctx), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a'), ctx), [['<blockquote><pre><br> a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>'), ctx), [['<blockquote><pre><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a'), ctx), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> http://host'), ctx), [['<blockquote><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> http://host)'), ctx), [['<blockquote><pre><a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> !http://host'), ctx), [['<blockquote><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> !http://host)'), ctx), [['<blockquote><pre>!<a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> #a'), ctx), [['<blockquote><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> @a#b'), ctx), [['<blockquote><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b'), ctx), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> >>1\n> > b\n> c'), ctx), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('> a\n>>'), ctx), [['<blockquote><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n> c'), ctx), [['<blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>> c'), ctx), [['<blockquote><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>>> c'), ctx), [['<blockquote><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a'), ctx), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>'), ctx), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b'), ctx), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>> b\n> c'), ctx), [['<blockquote><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b\n>>> c'), ctx), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>>> a\n>> b\n> c'), ctx), [['<blockquote><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

    it('markdown', () => {
      assert.deepStrictEqual(inspect(parser('!'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!> '), ctx), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\'), ctx), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n'), ctx), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a'), ctx), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n'), ctx), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb'), ctx), [['<blockquote><section><p>a<br>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ++a\nb++'), ctx), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ++a\n> b++'), ctx), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c '), ctx), [['<blockquote><section><p> a<br> b  c</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a'), ctx), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b'), ctx), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a'), ctx), [['<blockquote><section><ul><li>a</li></ul><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```'), ctx), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```'), ctx), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```'), ctx), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```'), ctx), [['<blockquote><section><pre class="text">a<br><br>b</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b'), ctx), [['<blockquote><section><p>a</p><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a'), ctx), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b'), ctx), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b'), ctx), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b'), ctx), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section><blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b'), ctx), [['<blockquote><blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> !> a'), ctx), [['<blockquote><section><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \na'), ctx), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!>\na'), ctx), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n a'), ctx), [['<blockquote><section><p> a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n>'), ctx), [['<blockquote><section><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n> a'), ctx), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ## a\n> ## a'), ctx), [['<blockquote><blockquote><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></blockquote><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~ a\n> ~ a'), ctx), [['<blockquote><blockquote><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ~~~figure $test-a\n>> > \n>>\n~~~\n> ~~~figure $test-a\n> > \n>\n[#a]\n~~~'), ctx), [['<blockquote><blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"><a class="index">a</a></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> ((a))\n> ((a))'), ctx), [['<blockquote><blockquote><section><p><sup class="annotation disabled" title="a"><span></span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>a</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote><section><p><sup class="annotation disabled" title="a"><span></span><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>a</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
    });

  });

});
