import { html } from './html';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = (source: string) => some(html)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>'), ctx), [['<span class="invalid">&lt;script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>'), ctx), [['<span class="invalid">&lt;script&gt;alert<span class="paren">()</span><span class="invalid">&lt;script&gt;</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>'), ctx), [['<span class="invalid">&lt;script&gt;alert<span class="paren">()</span>&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()">'), ctx), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()"></bdi>'), ctx), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()">a</bdi>'), ctx), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi onclick="alert()">a</bdi></bdi>'), ctx), [['<bdi><span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span></bdi>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<0>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<aT>'), ctx), [['<span class="invalid">&lt;aT&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<a,b>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<a, b>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<T>'), ctx), [['<span class="invalid">&lt;T&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr/>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<wbr />'), ctx), [['<span class="invalid">&lt;wbr /&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>z'), ctx), [['<span class="invalid">&lt;bdi&gt;z</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi></bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> </bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt; &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> \n</bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt; <br>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> \na</bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt; <br>a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\\ </bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt; &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>&Tab;</bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;\t&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><wbr></bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;<wbr>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\n</bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;<br>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\na</bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;<br>a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\\\na</bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;<br>a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a'), ctx), [['<span class="invalid">&lt;bdi&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a</BDI>'), ctx), [['<span class="invalid">&lt;bdi&gt;a&lt;/BDI&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<BDI>a</BDI>'), ctx), [['<span class="invalid">&lt;BDI&gt;</span>'], 'a</BDI>']);
      assert.deepStrictEqual(inspect(parser('<BDI>a</bdi>'), ctx), [['<span class="invalid">&lt;BDI&gt;</span>'], 'a</bdi>']);
      assert.deepStrictEqual(inspect(parser('</bdi>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi/>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi />'), ctx), [['<span class="invalid">&lt;bdi /&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<b><b><b>a</b></b></b>'), ctx), [['<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;a&lt;/b&gt;</span>&lt;/b&gt;</span>&lt;/b&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi><bdi>a</bdi></bdi></bdi>'), ctx), [['<bdi><bdi><bdi>a</bdi></bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*"'), ctx), [['<span class="invalid">&lt;x a="*b*"</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">'), ctx), [['<span class="invalid">&lt;x a="*b*"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">c'), ctx), [['<span class="invalid">&lt;x a="*b*"&gt;</span>'], 'c']);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*"'), ctx), [['<span class="invalid">&lt;bdi a="*b*"</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*">'), ctx), [['<span class="invalid">&lt;bdi a="*b*"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*">c'), ctx), [['<span class="invalid">&lt;bdi a="*b*"&gt;c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *c*'), ctx), [['<span class="invalid">&lt;bdi a b="*" *c*</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *c*>'), ctx), [['<span class="invalid">&lt;bdi a b="*" *c*&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *c*>d</bdi>'), ctx), [['<span class="invalid">&lt;bdi a b="*" *c*&gt;d&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *>*c*'), ctx), [['<span class="invalid">&lt;bdi a b="*" *&gt;<em>c</em></span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *>*c*</bdi>'), ctx), [['<span class="invalid">&lt;bdi a b="*" *&gt;<em>c</em>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' <bdi>a</bdi>'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<wbr>'), ctx), [['<wbr>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr >'), ctx), [['<wbr>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>a'), ctx), [['<wbr>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<bdi >a</bdi>'), ctx), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi  >a</bdi>'), ctx), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> a</bdi>'), ctx), [['<bdi> a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> a </bdi>'), ctx), [['<bdi> a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>  a  </bdi>'), ctx), [['<bdi>  a  </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\\ a</bdi>'), ctx), [['<bdi> a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><wbr>a</bdi>'), ctx), [['<bdi><wbr>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a</bdi>'), ctx), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a</bdi>a'), ctx), [['<bdi>a</bdi>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<bdi>a </bdi>'), ctx), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a \n </bdi>'), ctx), [['<bdi>a  </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\n</bdi>'), ctx), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\n </bdi>'), ctx), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\n<wbr></bdi>'), ctx), [['<bdi>a<wbr></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\nb</bdi>'), ctx), [['<bdi>a<br>b</bdi>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<bdi>[% </bdi>'), ctx), [['<span class="invalid">&lt;bdi&gt;[% &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi>a</bdi></bdi>'), ctx), [['<bdi><bdi>a</bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a<bdi>b</bdi>c</bdi>'), ctx), [['<bdi>a<bdi>b</bdi>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>`a`</bdi>'), ctx), [['<bdi><code data-src="`a`">a</code></bdi>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>'), ctx), [['<span class="invalid">&lt;a&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><a>a</a></bdi>'), ctx), [['<bdi><span class="invalid">&lt;a&gt;a&lt;/a&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a<a>b</a>c</bdi>'), ctx), [['<bdi>a<span class="invalid">&lt;a&gt;b&lt;/a&gt;</span>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>'), ctx), [['<span class="invalid">&lt;img&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><img></bdi>'), ctx), [['<bdi><span class="invalid">&lt;img&gt;</span></bdi>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('<bdi\n>a</bdi>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi \n>a</bdi>'), ctx), [['<span class="invalid">&lt;bdi <br>&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi __proto__>a</bdi>'), ctx), [['<span class="invalid">&lt;bdi __proto__&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi constructor>a</bdi>'), ctx), [['<span class="invalid">&lt;bdi constructor&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi toString>a</bdi>'), ctx), [['<span class="invalid">&lt;bdi toString&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi X>a</bdi>'), ctx), [['<span class="invalid">&lt;bdi X&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi x>a</bdi>'), ctx), [['<span class="invalid">&lt;bdi x&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo >a</bdo>'), ctx), [['<span class="invalid">&lt;bdo &gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo __proto__>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo __proto__&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo constructor>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo constructor&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo toString>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo toString&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo X>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo X&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo x>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo x&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo dir&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo dir=&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=rtl>a</bdo>'), ctx), [['<span class="invalid">&lt;bdo dir=rtl&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=">a</bdo>'), ctx), [['<span class="invalid">&lt;bdo dir="&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="">a</bdo>'), ctx), [['<span class="invalid">&lt;bdo dir=""&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" dir="rtl">a</bdo>'), ctx), [['<span class="invalid">&lt;bdo dir="rtl" dir="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo diR="rtl">a</bdo>'), ctx), [['<span class="invalid">&lt;bdo diR="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl">a</bdo>'), ctx), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" >a</bdo>'), ctx), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl"  >a</bdo>'), ctx), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo  dir="rtl">a</bdo>'), ctx), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr\n>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('<wbr \n>'), ctx), [['<span class="invalid">&lt;wbr </span>'], '\n>']);
      assert.deepStrictEqual(inspect(parser('<wbr constructor>'), ctx), [['<span class="invalid">&lt;wbr constructor&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr X>'), ctx), [['<span class="invalid">&lt;wbr X&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr x>'), ctx), [['<span class="invalid">&lt;wbr x&gt;</span>'], '']);
    });

  });

});
