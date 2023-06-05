import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = (source: string) => some(paragraph)({ source, context: {} });

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
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a&NewLine;b')), [['<p>a b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('&Tab;&NewLine;')), [['<p>&amp;Tab;&amp;NewLine;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>')), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>\n')), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>\na')), [['<p>&lt;wbr&gt;<br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n<wbr>\n')), [['<p>a<br>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n<wbr>\nb')), [['<p>a<br>&lt;wbr&gt;<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\n<wbr>*\nb')), [['<p>*a<br><wbr>*<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\n<wbr>**\nb')), [['<p>**a<br><wbr>**<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('***a\n<wbr>***\nb')), [['<p>***a<br><wbr>***<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b\n<wbr>**\nc')), [['<p>**<em>a</em>b<br><wbr>**<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b\n<wbr>*\nc')), [['<p>*<strong>a</strong>b<br><wbr>*<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\n<wbr>==\nb')), [['<p>==a<br><wbr>==<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host#\\')), [['<p><a class="url" href="http://host#\\" target="_blank">http://host#\\</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nhttp://host#\\ \nb')), [['<p>a<br><a class="url" href="http://host#\\" target="_blank">http://host#\\</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host#\\')), [['<p><a href="http://host#\\" target="_blank"><img class="media" data-src="http://host#\\" alt=""></a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host#\\ a')), [['<p>!<a class="url" href="http://host#" target="_blank">http://host#</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' !http://host#\\')), [['<p> !<a class="url" href="http://host#" target="_blank">http://host#</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('\ta')), [['<p>\ta</p>'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser('>>1 a\nb')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>2')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=2">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>b')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=b">&gt;&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>> b')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>&gt;&gt; b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11.')), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11 a')), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>11 a')), [['<p>&gt;<a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>1')), [['<p>&gt;&gt; a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>>1')), [['<p>a&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab>>1')), [['<p>ab&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >>1')), [['<p>a <a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1')), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1\nb')), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>> b\nc')), [['<p>a<br>&gt;&gt; b<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('\t>>1')), [['<p>\t<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('\t>>>1')), [['<p>\t&gt;<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('あ>>1')), [['<p>あ<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
    });

    it('remark', () => {
      assert.deepStrictEqual(inspect(parser('[% a %]')), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]b')), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]\nb')), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a %%]')), [['<p><span class="remark"><input type="checkbox"><span>[%% a %%]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%\n<wbr>\n%]')), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%\n<wbr>\n%]a')), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%\n<wbr>\n%]\na')), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span><br>a</p>'], '']);
    });

    it('template', () => {
      assert.deepStrictEqual(inspect(parser('{{\n\\\n}}')), [['<p><span class="template">{{\n\\\n}}</span></p>'], '']);
    });

  });

});
