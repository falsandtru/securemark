import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = some(blockquote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\na')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!>\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!>\na')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' > ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \\')), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \\\n')), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a')), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n')), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\nb')), [['<blockquote><pre>a<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n b ')), [['<blockquote><pre>a<br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>>1')), [['<blockquote><pre>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n> b ')), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n')), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\nb')), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n b ')), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n>')), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n>>1')), [['<blockquote><pre>a<br><br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n> b ')), [['<blockquote><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\\\nb')), [['<blockquote><pre>a\\<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>  a ')), [['<blockquote><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \na')), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> http://host')), [['<blockquote><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> http://host)')), [['<blockquote><pre><a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> !http://host')), [['<blockquote><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> !http://host)')), [['<blockquote><pre>!<a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> #a')), [['<blockquote><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> @a#b')), [['<blockquote><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>1\n> > b')), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>1\n> > b\n> c')), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('> a\n>>')), [['<blockquote><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>> b\n> c')), [['<blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>> b\n>> c')), [['<blockquote><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>> b\n>>> c')), [['<blockquote><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a')), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n>')), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n> b')), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n>>> b\n> c')), [['<blockquote><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n> b\n>>> c')), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>> a\n>> b\n> c')), [['<blockquote><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

    it('markdown', () => {
      assert.deepStrictEqual(inspect(parser, input('!')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> \\')), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> \\\n')), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a\n')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a\\\nb')), [['<blockquote><section><p>a<br>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ++a\nb++')), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ++a\n> b++')), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>  a \n b  c ')), [['<blockquote><section><p> a<br> b c</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> a')), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> a\n> b')), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> - a')), [['<blockquote><section><ul><li id="index:random:a">a</li></ul><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\na\n```')), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\n> a\n```')), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\n> a\n> ```')), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><section><pre class="text">a<br><br>b</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a\n>\n> b')), [['<blockquote><section><p>a</p><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a')), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a\n> b')), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a\n> > b')), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a\n>> b')), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section><blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> > a\n> b')), [['<blockquote><blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> !> a')), [['<blockquote><section><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> \na')), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ## a\n> ## a')), [['<blockquote><blockquote><section><h2 id="index:random:a">a</h2><h2>References</h2><ol class="references"></ol></section></blockquote><section><h2 id="index:random:a">a</h2><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ~ a\n> ~ a')), [['<blockquote><blockquote><section><dl><dt id="index:random:a">a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote><section><dl><dt id="index:random:a">a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ~~~figure $test-a\n>> > \n>>\n~~~\n> ~~~figure $test-a\n> > \n>\n[#a]\n~~~')), [['<blockquote><blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:random:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:random:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"><a class="index" href="#index:random:a">a</a></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ((a))\n> ((a))')), [['<blockquote><blockquote><section><p><sup class="annotation" id="annotation:random:ref:a:1" title="a"><a href="#annotation:random:def:a:1">*1</a></sup></p><ol class="annotations"><li id="annotation:random:def:a:1" data-marker="*1"><span>a</span><sup><a href="#annotation:random:ref:a:1">^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote><section><p><sup class="annotation" id="annotation:random:ref:a:1" title="a"><a href="#annotation:random:def:a:1">*1</a></sup></p><ol class="annotations"><li id="annotation:random:def:a:1" data-marker="*1"><span>a</span><sup><a href="#annotation:random:ref:a:1">^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
    });

  });

});
