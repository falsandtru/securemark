import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = (source: string) => some(paragraph)(source, {});

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\\')), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\\\n')), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\ ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\ \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<span class="linebreak"> </span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>')), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>\n')), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>\na')), [['<p>&lt;wbr&gt;<br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n<wbr>\n')), [['<p>a<br>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n<wbr>\nb')), [['<p>a<br>&lt;wbr&gt;<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('mention', () => {
      assert.deepStrictEqual(inspect(parser('>>1')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br>a<br><a href="?comment=2" class="anchor">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n>>2')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br><span class="cite">&gt;<a href="?comment=2" class="anchor" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\nb')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>>2')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br><span class="cite">&gt;<a href="?comment=2" class="anchor" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>> b')), [['<p><span class="cite">&gt;<a href="?comment=1" class="anchor" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a<br>&gt;&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\nb')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>2')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br><a href="?comment=2" class="anchor">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>b')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br><a href="?comment=b" class="anchor">&gt;&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>> b')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br><span class="quote invalid">&gt;&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11.')), [['<p><a href="?comment=11" class="anchor">&gt;&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11 a')), [['<p><a href="?comment=11" class="anchor">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>11 a')), [['<p>&gt;<a href="?comment=11" class="anchor">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>1')), [['<p><span class="quote invalid">&gt;&gt; a</span><br><a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>>1')), [['<p>a<a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >>1')), [['<p>a <a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1')), [['<p>a<br><a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1\nb')), [['<p>a<br><a href="?comment=1" class="anchor">&gt;&gt;1</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>> b\nc')), [['<p>a<br><span class="quote invalid">&gt;&gt; b</span><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >>1')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >>>1')), [['<p>&gt;<a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('[# a #]')), [['<p>[# a #]</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]b')), [['<p><sup class="comment" title="a"></sup>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]\nb')), [['<p>[# a #]<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\n<wbr>\n#]')), [['<p>[#<br>&lt;wbr&gt;<br>#]</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\n<wbr>\n#]a')), [['<p><sup class="comment" title="<wbr>"></sup>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\n<wbr>\n#]\na')), [['<p>[#<br>&lt;wbr&gt;<br>#]<br>a</p>'], '']);
    });

    it('template', () => {
      assert.deepStrictEqual(inspect(parser('{{\n\\\n}}')), [['<p><span class="template">{{\n\\\n}}</span></p>'], '']);
    });

  });

});
