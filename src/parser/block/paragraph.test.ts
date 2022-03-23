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

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser('>>1 a\nb')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>2')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br><a href="?comment=2" class="anchor">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>b')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br><a href="?comment=b" class="anchor">&gt;&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>> b')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a> a<br>&gt;&gt; b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11.')), [['<p><a href="?comment=11" class="anchor">&gt;&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11 a')), [['<p><a href="?comment=11" class="anchor">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>11 a')), [['<p>&gt;<a href="?comment=11" class="anchor">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>1')), [['<p>&gt;&gt; a<br><a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>>1')), [['<p>a<a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >>1')), [['<p>a <a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1')), [['<p>a<br><a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1\nb')), [['<p>a<br><a href="?comment=1" class="anchor">&gt;&gt;1</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>> b\nc')), [['<p>a<br>&gt;&gt; b<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >>1')), [['<p><a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >>>1')), [['<p>&gt;<a href="?comment=1" class="anchor">&gt;&gt;1</a></p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('[# a #]')), [['<p><span class="comment">[# a #]</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]b')), [['<p><span class="comment">[# a #]</span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[# a #]\nb')), [['<p><span class="comment">[# a #]</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[## a ##]')), [['<p><span class="comment">[## a ##]</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\n<wbr>\n#]')), [['<p><span class="comment">[# &lt;wbr&gt; #]</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\n<wbr>\n#]a')), [['<p><span class="comment">[# &lt;wbr&gt; #]</span>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[#\n<wbr>\n#]\na')), [['<p><span class="comment">[# &lt;wbr&gt; #]</span><br>a</p>'], '']);
    });

    it('template', () => {
      assert.deepStrictEqual(inspect(parser('{{\n\\\n}}')), [['<p><span class="template">{{\n\\\n}}</span></p>'], '']);
    });

  });

});
