import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = (source: string) => some(paragraph)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a'), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab'), ctx), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\'), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a '), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a \n'), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n'), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb'), ctx), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\\'), ctx), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\\\n'), ctx), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\ '), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\ \n'), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n'), ctx), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb'), ctx), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a&NewLine;b'), ctx), [['<p>a b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('&Tab;&NewLine;'), ctx), [['<p>&amp;Tab;&amp;NewLine;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>'), ctx), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>\n'), ctx), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>\na'), ctx), [['<p>&lt;wbr&gt;<br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n<wbr>\n'), ctx), [['<p>a<br>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n<wbr>\nb'), ctx), [['<p>a<br>&lt;wbr&gt;<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\n<wbr>*\nb'), ctx), [['<p>*a<br><wbr>*<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\n<wbr>**\nb'), ctx), [['<p>**a<br><wbr>**<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('***a\n<wbr>***\nb'), ctx), [['<p>***a<br><wbr>***<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b\n<wbr>**\nc'), ctx), [['<p>**<em>a</em>b<br><wbr>**<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b\n<wbr>*\nc'), ctx), [['<p>*<strong>a</strong>b<br><wbr>*<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('==a\n<wbr>==\nb'), ctx), [['<p>==a<br><wbr>==<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host)'), ctx), [['<p><a class="url" href="http://host)" target="_blank">http://host)</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nhttp://host) \nb'), ctx), [['<p>a<br><a class="url" href="http://host)" target="_blank">http://host)</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('!http://host)'), ctx), [['<p>!<a class="url" href="http://host)" target="_blank">http://host)</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n!http://host) \nb'), ctx), [['<p>a<br>!<a class="url" href="http://host)" target="_blank">http://host)</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('\ta'), ctx), [['<p>\ta</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A]]'), ctx), [['<p><sup class="reference" data-abbr="A"><span></span></sup></p>'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser('>>1 a\nb'), ctx), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>2'), ctx), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=2">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>>b'), ctx), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=b">&gt;&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1 a\n>> b'), ctx), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>&gt;&gt; b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11.'), ctx), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>11 a'), ctx), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>>11 a'), ctx), [['<p>&gt;<a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>1'), ctx), [['<p>&gt;&gt; a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>>1'), ctx), [['<p>a&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab>>1'), ctx), [['<p>ab&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >>1'), ctx), [['<p>a <a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1'), ctx), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>>1\nb'), ctx), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>> b\nc'), ctx), [['<p>a<br>&gt;&gt; b<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('\t>>1'), ctx), [['<p>\t<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('\t>>>1'), ctx), [['<p>\t&gt;<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('あ>>1'), ctx), [['<p>あ<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
    });

    it('remark', () => {
      assert.deepStrictEqual(inspect(parser('[% a %]'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]b'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[% a %]\nb'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%% a %%]'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[%% a %%]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%\n<wbr>\n%]'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%\n<wbr>\n%]a'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('[%\n<wbr>\n%]\na'), ctx), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span><br>a</p>'], '']);
    });

    it('template', () => {
      assert.deepStrictEqual(inspect(parser('{{\n\\\n}}'), ctx), [['<p><span class="template">{{<br>\\<br>}}</span></p>'], '']);
    });

  });

});
