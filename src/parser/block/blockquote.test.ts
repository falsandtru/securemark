import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = some(blockquote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!>\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!>\na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' > ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('> ', new Context())), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \\', new Context())), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \\\n', new Context())), [['<blockquote><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a', new Context())), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n', new Context())), [['<blockquote><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\nb', new Context())), [['<blockquote><pre>a<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n b ', new Context())), [['<blockquote><pre>a<br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>', new Context())), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>>1', new Context())), [['<blockquote><pre>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n> b ', new Context())), [['<blockquote><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n', new Context())), [['<blockquote><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\nb', new Context())), [['<blockquote><pre>a<br><br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n b ', new Context())), [['<blockquote><pre>a<br><br> b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n>', new Context())), [['<blockquote><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n>>1', new Context())), [['<blockquote><pre>a<br><br><a class="anchor" href="?at=1">&gt;&gt;1</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>\n> b ', new Context())), [['<blockquote><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\\\nb', new Context())), [['<blockquote><pre>a\\<br>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>  a ', new Context())), [['<blockquote><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> \na', new Context())), [['<blockquote><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> http://host', new Context())), [['<blockquote><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> http://host)', new Context())), [['<blockquote><pre><a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> !http://host', new Context())), [['<blockquote><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> !http://host)', new Context())), [['<blockquote><pre>!<a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> #a', new Context())), [['<blockquote><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> @a#b', new Context())), [['<blockquote><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>1\n> > b', new Context())), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> >>1\n> > b\n> c', new Context())), [['<blockquote><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>&gt; b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('> a\n>>', new Context())), [['<blockquote><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>> b\n> c', new Context())), [['<blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>> b\n>> c', new Context())), [['<blockquote><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('> a\n>> b\n>>> c', new Context())), [['<blockquote><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a', new Context())), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n>', new Context())), [['<blockquote><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n> b', new Context())), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n>>> b\n> c', new Context())), [['<blockquote><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n> b\n>>> c', new Context())), [['<blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>> a\n>> b\n> c', new Context())), [['<blockquote><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

    it('markdown', () => {
      assert.deepStrictEqual(inspect(parser, input('!', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!> ', new Context())), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> \\', new Context())), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> \\\n', new Context())), [['<blockquote><section><p>\\</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a', new Context())), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a\n', new Context())), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a\\\nb', new Context())), [['<blockquote><section><p>a<br>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ++a\nb++', new Context())), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ++a\n> b++', new Context())), [['<blockquote><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>  a \n b  c ', new Context())), [['<blockquote><section><p> a<br> b c</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> a', new Context())), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> a\n> b', new Context())), [['<blockquote><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> - a', new Context())), [['<blockquote><section><ul><li>a</li></ul><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\na\n```', new Context())), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\n> a\n```', new Context())), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\n> a\n> ```', new Context())), [['<blockquote><section><pre class="text">a</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> ```\n> a\n> \n> b\n> ```', new Context())), [['<blockquote><section><pre class="text">a<br><br>b</pre><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> a\n>\n> b', new Context())), [['<blockquote><section><p>a</p><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a', new Context())), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a\n> b', new Context())), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a\n> > b', new Context())), [['<blockquote><section><blockquote><pre>a<br>b</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> > a\n>> b', new Context())), [['<blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section><blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> > a\n> b', new Context())), [['<blockquote><blockquote><section><blockquote><pre>a</pre></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote><section><p>b</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> !> a', new Context())), [['<blockquote><section><blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!> \na', new Context())), [['<blockquote><section><p>a</p><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ## a\n> ## a', new Context())), [['<blockquote><blockquote><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></blockquote><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ~ a\n> ~ a', new Context())), [['<blockquote><blockquote><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ~~~figure $test-a\n>> > \n>>\n~~~\n> ~~~figure $test-a\n> > \n>\n[#a]\n~~~', new Context())), [['<blockquote><blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"><a class="index">a</a></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!>> ((a))\n> ((a))', new Context())), [['<blockquote><blockquote><section><p><sup class="annotation disabled" title="a"><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>a</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote><section><p><sup class="annotation disabled" title="a"><a>*1</a></sup></p><ol class="annotations"><li data-marker="*1"><span>a</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"></ol></section></blockquote>'], '']);
    });

  });

});
