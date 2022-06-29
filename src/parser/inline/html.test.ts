import { html } from './html';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = (source: string) => some(html)(source, {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), [['<span class="invalid">&lt;script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), [['<span class="invalid">&lt;script&gt;alert<span class="paren">()</span><span class="invalid">&lt;script&gt;</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), [['<span class="invalid">&lt;script&gt;alert<span class="paren">()</span>&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script src="\\""></script>')), [['<span class="invalid">&lt;script src="\\""&gt;&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()">')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()"></bdi>')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()">a</bdi>')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi onclick="alert()">a</bdi></bdi>')), [['<bdi><span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl\\"><">a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl\\"&gt;&lt;"&gt;a&lt;/bdo&gt;</span>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<0>')), undefined);
      assert.deepStrictEqual(inspect(parser('<aT>')), [['<span class="invalid">&lt;aT&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<a,b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a, b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<T>')), [['<span class="invalid">&lt;T&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>')), [['<span class="invalid">&lt;bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>z')), [['<span class="invalid">&lt;bdi&gt;z</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi></bdi>')), [['<span class="invalid">&lt;bdi&gt;&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> </bdi>')), [['<span class="invalid">&lt;bdi&gt; &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> \n</bdi>')), [['<span class="invalid">&lt;bdi&gt;<br>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> \na</bdi>')), [['<span class="invalid">&lt;bdi&gt;<br>a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\\ </bdi>')), [['<span class="invalid">&lt;bdi&gt; &lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>&Tab;</bdi>')), [['<span class="invalid">&lt;bdi&gt;\t&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><wbr></bdi>')), [['<span class="invalid">&lt;bdi&gt;<wbr>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\n</bdi>')), [['<span class="invalid">&lt;bdi&gt;<br>&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\na</bdi>')), [['<span class="invalid">&lt;bdi&gt;<br>a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\\\na</bdi>')), [['<span class="invalid">&lt;bdi&gt;<span class="linebreak"> </span>a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a')), [['<span class="invalid">&lt;bdi&gt;a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a</BDO>')), [['<span class="invalid">&lt;bdi&gt;a&lt;/BDO&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<BDI>a</BDI>')), [['<span class="invalid">&lt;BDI&gt;a&lt;/BDI&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<BDI>a</bdo>')), [['<span class="invalid">&lt;BDI&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi/>')), undefined);
      assert.deepStrictEqual(inspect(parser('<b><b><b>a</b></b></b>')), [['<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;a&lt;/b&gt;</span>&lt;/b&gt;</span>&lt;/b&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi><bdi>a</bdi></bdi></bdi>')), [['<bdi><bdi><bdi>a</bdi></bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*"')), undefined);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">')), [['<span class="invalid">&lt;x a="*b*"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">c')), [['<span class="invalid">&lt;x a="*b*"&gt;c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*"')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*">')), [['<span class="invalid">&lt;bdi a="*b*"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*">c')), [['<span class="invalid">&lt;bdi a="*b*"&gt;c</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *c*')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *c*>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *c*>d</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *>*c*')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a b="*" *>*c*</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser(' <bdi>a</bdi>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<bdi> a</bdi>')), [['<bdi> a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi> a </bdi>')), [['<bdi> a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>  a  </bdi>')), [['<bdi>  a  </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>\\ a</bdi>')), [['<bdi> a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><wbr>a</bdi>')), [['<bdi><wbr>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a</bdi>a')), [['<bdi>a</bdi>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<bdi>a </bdi>')), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a \n </bdi>')), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\n</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\n </bdi>')), [['<bdi>a </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\n<wbr></bdi>')), [['<bdi>a<wbr></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a\nb</bdi>')), [['<bdi>a<br>b</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>a')), [['<wbr>'], 'a']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<bdi>[% </bdi>')), [['<bdi>[% </bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi>a</bdi></bdi>')), [['<bdi><bdi>a</bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a<bdi>b</bdi>c</bdi>')), [['<bdi>a<bdi>b</bdi>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>`a`</bdi>')), [['<bdi><code data-src="`a`">a</code></bdi>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), [['<span class="invalid">&lt;a&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><a>a</a></bdi>')), [['<bdi><span class="invalid">&lt;a&gt;a&lt;/a&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a<a>b</a>c</bdi>')), [['<bdi>a<span class="invalid">&lt;a&gt;b&lt;/a&gt;</span>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), [['<span class="invalid">&lt;img&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><img></bdi>')), [['<bdi><span class="invalid">&lt;img&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi><img /></bdi>')), [['<bdi>&lt;img /&gt;</bdi>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('<bdi\n>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi >a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi \n>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi  >a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi __proto__>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi constructor>a</bdi>')), [['<span class="invalid">&lt;bdi constructor&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi toString>a</bdi>')), [['<span class="invalid">&lt;bdi toString&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi X>a</bdi>')), [['<span class="invalid">&lt;bdi X&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi x>a</bdi>')), [['<span class="invalid">&lt;bdi x&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo>a</bdo>')), [['<span class="invalid">&lt;bdo&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo >a</bdo>')), [['<span class="invalid">&lt;bdo &gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo __proto__>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo constructor>a</bdo>')), [['<span class="invalid">&lt;bdo constructor&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo toString>a</bdo>')), [['<span class="invalid">&lt;bdo toString&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo X>a</bdo>')), [['<span class="invalid">&lt;bdo X&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo x>a</bdo>')), [['<span class="invalid">&lt;bdo x&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir>a</bdo>')), [['<span class="invalid">&lt;bdo dir&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=rtl>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=">a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir="">a</bdo>')), [['<span class="invalid">&lt;bdo dir=""&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" dir="rtl">a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl" dir="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo diR="rtl">a</bdo>')), [['<span class="invalid">&lt;bdo diR="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" >a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl"  >a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo  dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr\n>')), undefined);
      assert.deepStrictEqual(inspect(parser('<wbr >')), [['<wbr>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr constructor>')), [['<span class="invalid">&lt;wbr constructor&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr X>')), [['<span class="invalid">&lt;wbr X&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr x>')), [['<span class="invalid">&lt;wbr x&gt;</span>'], '']);
    });

  });

});
