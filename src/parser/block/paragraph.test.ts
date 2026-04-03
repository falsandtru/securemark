import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = some(paragraph);

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n\\')), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n\\\n')), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\ ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\ \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a&NewLine;b')), [['<p>a<span class="invalid">&amp;NewLine;</span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('&Tab;&nbsp;')), [['<p>&amp;Tab;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>')), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>\n')), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>\na')), [['<p>&lt;wbr&gt;<br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n<wbr>\n')), [['<p>a<br>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n<wbr>\nb')), [['<p>a<br>&lt;wbr&gt;<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\n<wbr>*\nb')), [['<p>*a<br><wbr>*<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\n<wbr>**\nb')), [['<p>**a<br><wbr>**<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('***a\n<wbr>***\nb')), [['<p>***a<br><wbr>***<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('***a*b\n<wbr>**\nc')), [['<p>**<em>a</em>b<br><wbr>**<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('***a**b\n<wbr>*\nc')), [['<p>*<strong>a</strong>b<br><wbr>*<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\n<wbr>==\nb')), [['<p>==a<br><wbr>==<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('http://host)')), [['<p><a class="url" href="http://host)" target="_blank">http://host)</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nhttp://host) \nb')), [['<p>a<br><a class="url" href="http://host)" target="_blank">http://host)</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!http://host)')), [['<p>!<a class="url" href="http://host)" target="_blank">http://host)</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n!http://host) \nb')), [['<p>a<br>!<a class="url" href="http://host)" target="_blank">http://host)</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\ta')), [['<p>\ta</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A]]')), [['<p><sup class="reference" data-abbr="A"><span></span></sup></p>'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser, input('>>1 a\nb')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1 a\n>>2')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=2">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1 a\n>>b')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=b">&gt;&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1 a\n>> b')), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>&gt;&gt; b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>11.')), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>11 a')), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>>11 a')), [['<p>&gt;<a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n>>1')), [['<p>&gt;&gt; a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a>>1')), [['<p>a&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab>>1')), [['<p>ab&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a >>1')), [['<p>a <a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n>>1')), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n>>1\nb')), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n>> b\nc')), [['<p>a<br>&gt;&gt; b<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\t>>1')), [['<p>\t<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\t>>>1')), [['<p>\t&gt;<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('あ>>1')), [['<p>あ<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
    });

    it('remark', () => {
      assert.deepStrictEqual(inspect(parser, input('[% a %]')), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]b')), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]\nb')), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%\n<wbr>\n%]')), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%\n<wbr>\n%]a')), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%\n<wbr>\n%]\na')), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span><br>a</p>'], '']);
    });

    it('template', () => {
      assert.deepStrictEqual(inspect(parser, input('{{\n\\\n}}')), [['<p><span class="template">{{<br>\\<br>}}</span></p>'], '']);
    });

  });

});
