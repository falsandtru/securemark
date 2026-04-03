import { html, TAGS } from './html';
import { Output } from '../../combinator/parser';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = some(html);

    it('hash', () => {
      assert(TAGS.every(tag => parser(input(`<${tag}>`), new Output())));
    });

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser, input('<script>')), [['<span class="invalid">&lt;script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<script>alert()<script>')), [['<span class="invalid">&lt;script&gt;alert()&lt;script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<script>alert()</script>')), [['<span class="invalid">&lt;script&gt;alert()&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi onclick="alert()">')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi onclick="alert()"></bdi>')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi onclick="alert()">a</bdi>')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><bdi onclick="alert()">a</bdi></bdi>')), [['<bdi><span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span></bdi>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<0>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<aT>')), [['<span class="invalid">&lt;aT&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<a,b>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<a, b>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<T>')), [['<span class="invalid">&lt;T&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr/>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<wbr />')), [['<span class="invalid">&lt;wbr /&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>')), [['<span class="invalid">&lt;bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>z')), [['<span class="invalid">&lt;bdi&gt;z</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi></bdi>')), [['<span class="invalid">&lt;bdi&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi> </bdi>')), [['<span class="invalid">&lt;bdi&gt; &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi> \n</bdi>')), [['<span class="invalid">&lt;bdi&gt; \n&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi> \na</bdi>')), [['<span class="invalid">&lt;bdi&gt; \na&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>\\ </bdi>')), [['<span class="invalid">&lt;bdi&gt;\\ &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>&Tab;</bdi>')), [['<span class="invalid">&lt;bdi&gt;&amp;Tab;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><wbr></bdi>')), [['<span class="invalid">&lt;bdi&gt;&lt;wbr&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>\n</bdi>')), [['<span class="invalid">&lt;bdi&gt;\n&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>\na</bdi>')), [['<span class="invalid">&lt;bdi&gt;\na&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>\\\na</bdi>')), [['<span class="invalid">&lt;bdi&gt;\\\na&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a')), [['<span class="invalid">&lt;bdi&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a</BDI>')), [['<span class="invalid">&lt;bdi&gt;a&lt;/BDI&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<BDI>a</BDI>')), [['<span class="invalid">&lt;BDI&gt;</span>'], 'a</BDI>']);
      assert.deepStrictEqual(inspect(parser, input('<BDI>a</bdi>')), [['<span class="invalid">&lt;BDI&gt;</span>'], 'a</bdi>']);
      assert.deepStrictEqual(inspect(parser, input('</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<bdi/>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<bdi />')), [['<span class="invalid">&lt;bdi /&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<b><b><b>a</b></b></b>')), [['<span class="invalid">&lt;b&gt;&lt;b&gt;&lt;b&gt;a&lt;/b&gt;&lt;/b&gt;&lt;/b&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><bdi><bdi>a</bdi></bdi></bdi>')), [['<bdi><bdi><bdi>a</bdi></bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<x a="*b*"')), [['<span class="invalid">&lt;x a="*b*"</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<x a="*b*">')), [['<span class="invalid">&lt;x a="*b*"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<x a="*b*">c')), [['<span class="invalid">&lt;x a="*b*"&gt;</span>'], 'c']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a="*b*"')), [['<span class="invalid">&lt;bdi a="*b*"</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a="*b*">')), [['<span class="invalid">&lt;bdi a="*b*"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a="*b*">c')), [['<span class="invalid">&lt;bdi a="*b*"&gt;c</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a b="*" *c*')), [['<span class="invalid">&lt;bdi a b="*" *c*</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a b="*" *c*>')), [['<span class="invalid">&lt;bdi a b="*" *c*&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a b="*" *c*>d</bdi>')), [['<span class="invalid">&lt;bdi a b="*" *c*&gt;d&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a b="*" *>*c*')), [['<span class="invalid">&lt;bdi a b="*" *&gt;*c*</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi a b="*" *>*c*</bdi>')), [['<span class="invalid">&lt;bdi a b="*" *&gt;*c*&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' <bdi>a</bdi>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('<wbr>')), [['<wbr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr >')), [['<wbr>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr  >')), [['<span class="invalid">&lt;wbr </span>'], ' >']);
      assert.deepStrictEqual(inspect(parser, input('<wbr>a')), [['<wbr>'], 'a']);
      assert.deepStrictEqual(inspect(parser, input('<bdi >a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi  >a</bdi>')), [['<span class="invalid">&lt;bdi  &gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi> a</bdi>')), [['<bdi> a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi> a </bdi>')), [['<bdi> a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>  a  </bdi>')), [['<bdi> a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>\\ a</bdi>')), [['<bdi> a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><wbr>a</bdi>')), [['<bdi><wbr>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a</bdi>a')), [['<bdi>a</bdi>'], 'a']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a </bdi>')), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a \n </bdi>')), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a\n</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a\n </bdi>')), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a\n<wbr></bdi>')), [['<bdi>a<wbr></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a\nb</bdi>')), [['<bdi>a<br>b</bdi>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('<bdi>[% </bdi>')), [['<span class="invalid">&lt;bdi&gt;[% &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><bdi>a</bdi></bdi>')), [['<bdi><bdi>a</bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a<bdi>b</bdi>c</bdi>')), [['<bdi>a<bdi>b</bdi>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>`a`</bdi>')), [['<bdi><code data-src="`a`">a</code></bdi>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser, input('<a>')), [['<span class="invalid">&lt;a&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><a>a</a></bdi>')), [['<bdi><span class="invalid">&lt;a&gt;a&lt;/a&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi>a<a>b</a>c</bdi>')), [['<bdi>a<span class="invalid">&lt;a&gt;b&lt;/a&gt;</span>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<img>')), [['<span class="invalid">&lt;img&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi><img></bdi>')), [['<bdi><span class="invalid">&lt;img&gt;</span></bdi>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('<bdi\n>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<bdi \n>a</bdi>')), [['<span class="invalid">&lt;bdi \n&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi __proto__>a</bdi>')), [['<span class="invalid">&lt;bdi __proto__&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi constructor>a</bdi>')), [['<span class="invalid">&lt;bdi constructor&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi toString>a</bdi>')), [['<span class="invalid">&lt;bdi toString&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi X>a</bdi>')), [['<span class="invalid">&lt;bdi X&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdi x>a</bdi>')), [['<span class="invalid">&lt;bdi x&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo>a</bdo>')), [['<span class="invalid">&lt;bdo&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo >a</bdo>')), [['<span class="invalid">&lt;bdo &gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo __proto__>a</bdo>')), [['<span class="invalid">&lt;bdo __proto__&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo constructor>a</bdo>')), [['<span class="invalid">&lt;bdo constructor&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo toString>a</bdo>')), [['<span class="invalid">&lt;bdo toString&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo X>a</bdo>')), [['<span class="invalid">&lt;bdo X&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo x>a</bdo>')), [['<span class="invalid">&lt;bdo x&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir>a</bdo>')), [['<span class="invalid">&lt;bdo dir&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir=>a</bdo>')), [['<span class="invalid">&lt;bdo dir=&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir=rtl>a</bdo>')), [['<span class="invalid">&lt;bdo dir=rtl&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir=">a</bdo>')), [['<span class="invalid">&lt;bdo dir="&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir="">a</bdo>')), [['<span class="invalid">&lt;bdo dir=""&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir="rtl" dir="rtl">a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl" dir="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo diR="rtl">a</bdo>')), [['<span class="invalid">&lt;bdo diR="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir="rtl" >a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo dir="rtl"  >a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl"  &gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<bdo  dir="rtl">a</bdo>')), [['<span class="invalid">&lt;bdo  dir="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr\n>')), undefined);
      assert.deepStrictEqual(inspect(parser, input('<wbr \n>')), [['<span class="invalid">&lt;wbr </span>'], '\n>']);
      assert.deepStrictEqual(inspect(parser, input('<wbr constructor>')), [['<span class="invalid">&lt;wbr constructor&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr X>')), [['<span class="invalid">&lt;wbr X&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('<wbr x>')), [['<span class="invalid">&lt;wbr x&gt;</span>'], '']);
    });

  });

});
