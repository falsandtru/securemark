import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = some(paragraph);

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a ', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \n', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nb', new Context())), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n\\', new Context())), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n\\\n', new Context())), [['<p>a<br>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\ ', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\ \n', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\n', new Context())), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\nb', new Context())), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a&NewLine;b', new Context())), [['<p>a b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('&Tab;&NewLine;', new Context())), [['<p>&amp;Tab;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>', new Context())), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>\n', new Context())), [['<p>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>\na', new Context())), [['<p>&lt;wbr&gt;<br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n<wbr>\n', new Context())), [['<p>a<br>&lt;wbr&gt;</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n<wbr>\nb', new Context())), [['<p>a<br>&lt;wbr&gt;<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\n<wbr>*\nb', new Context())), [['<p>*a<br><wbr>*<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\n<wbr>**\nb', new Context())), [['<p>**a<br><wbr>**<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('***a\n<wbr>***\nb', new Context())), [['<p>***a<br><wbr>***<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('***a*b\n<wbr>**\nc', new Context())), [['<p>**<em>a</em>b<br><wbr>**<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('***a**b\n<wbr>*\nc', new Context())), [['<p>*<strong>a</strong>b<br><wbr>*<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('==a\n<wbr>==\nb', new Context())), [['<p>==a<br><wbr>==<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('http://host)', new Context())), [['<p><a class="url" href="http://host)" target="_blank">http://host)</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nhttp://host) \nb', new Context())), [['<p>a<br><a class="url" href="http://host)" target="_blank">http://host)</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!http://host)', new Context())), [['<p>!<a class="url" href="http://host)" target="_blank">http://host)</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n!http://host) \nb', new Context())), [['<p>a<br>!<a class="url" href="http://host)" target="_blank">http://host)</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\ta', new Context())), [['<p>\ta</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A]]', new Context())), [['<p><sup class="reference" data-abbr="A"><span></span></sup></p>'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser, input('>>1 a\nb', new Context())), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1 a\n>>2', new Context())), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=2">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1 a\n>>b', new Context())), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br><a class="anchor" href="?at=b">&gt;&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1 a\n>> b', new Context())), [['<p><a class="anchor" href="?at=1">&gt;&gt;1</a> a<br>&gt;&gt; b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>11.', new Context())), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>11 a', new Context())), [['<p><a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>>11 a', new Context())), [['<p>&gt;<a class="anchor" href="?at=11">&gt;&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>> a\n>>1', new Context())), [['<p>&gt;&gt; a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a>>1', new Context())), [['<p>a&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab>>1', new Context())), [['<p>ab&gt;&gt;1</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a >>1', new Context())), [['<p>a <a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n>>1', new Context())), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n>>1\nb', new Context())), [['<p>a<br><a class="anchor" href="?at=1">&gt;&gt;1</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\n>> b\nc', new Context())), [['<p>a<br>&gt;&gt; b<br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\t>>1', new Context())), [['<p>\t<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\t>>>1', new Context())), [['<p>\t&gt;<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('あ>>1', new Context())), [['<p>あ<a class="anchor" href="?at=1">&gt;&gt;1</a></p>'], '']);
    });

    it('remark', () => {
      assert.deepStrictEqual(inspect(parser, input('[% a %]', new Context())), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]b', new Context())), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[% a %]\nb', new Context())), [['<p><span class="remark"><input type="checkbox"><span>[% a %]</span></span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%\n<wbr>\n%]', new Context())), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%\n<wbr>\n%]a', new Context())), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[%\n<wbr>\n%]\na', new Context())), [['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span><br>a</p>'], '']);
    });

    it('template', () => {
      assert.deepStrictEqual(inspect(parser, input('{{\n\\\n}}', new Context())), [['<p><span class="template">{{<br>\\<br>}}</span></p>'], '']);
    });

  });

});
