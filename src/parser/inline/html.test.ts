import { html } from './html';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = (source: string) => some(html)(source, {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), [['<span class="invalid">&lt;script&gt;alert<span class="paren">()</span>&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script src="\\""></script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()">')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()"></bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi onclick="alert()">a</bdi>')), [['<span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi onclick="alert()">a</bdi></bdi>')), [['<bdi><span class="invalid">&lt;bdi onclick="alert()"&gt;a&lt;/bdi&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl\\"><">a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl\\"&gt;&lt;"&gt;a&lt;/bdo&gt;</span>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<0>')), undefined);
      assert.deepStrictEqual(inspect(parser('<aT>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a,b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a, b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<T>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi></bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi> </bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>\\ </bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>&Tab;</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi><wbr></bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>\n</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>\na</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>\\\na</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>a')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi>a</BDO>')), undefined);
      assert.deepStrictEqual(inspect(parser('<BDI>a</BDI>')), undefined);
      assert.deepStrictEqual(inspect(parser('<BDI>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi/>')), undefined);
      assert.deepStrictEqual(inspect(parser('<b><b><b>a</b></b></b>')), [['<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;a&lt;/b&gt;</span>&lt;/b&gt;</span>&lt;/b&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi><bdi><bdi>a</bdi></bdi></bdi>')), [['<bdi><bdi><bdi>a</bdi></bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*"')), undefined);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">')), undefined);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">c')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*"')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*">')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi a="*b*">c')), undefined);
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
      assert.deepStrictEqual(inspect(parser('<bdi><bdi>a</bdi></bdi>')), [['<bdi><bdi>a</bdi></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a<bdi>b</bdi>c</bdi>')), [['<bdi>a<bdi>b</bdi>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>`a`</bdi>')), [['<bdi><code data-src="`a`">a</code></bdi>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi><a>a</a></bdi>')), [['<bdi><span class="invalid">&lt;a&gt;a&lt;/a&gt;</span></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>a<a>b</a>c</bdi>')), [['<bdi>a<span class="invalid">&lt;a&gt;b&lt;/a&gt;</span>c</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), [['<img'], '>']);
      assert.deepStrictEqual(inspect(parser('<bdi><img></bdi>')), [['<bdi>&lt;img&gt;</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), [['<img'], ' />']);
      assert.deepStrictEqual(inspect(parser('<bdi><img /></bdi>')), [['<bdi>&lt;img /&gt;</bdi>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('<bdi\n>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi >a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi \n>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi  >a</bdi>')), [['<bdi>a</bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi __proto__>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi constructor>a</bdi>')), [['<span class="invalid">&lt;bdi constructor&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi toString>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi X>a</bdi>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdi x>a</bdi>')), [['<span class="invalid">&lt;bdi x&gt;a&lt;/bdi&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo>a</bdo>')), [['<span class="invalid">&lt;bdo&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo >a</bdo>')), [['<span class="invalid">&lt;bdo &gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo __proto__>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo constructor>a</bdo>')), [['<span class="invalid">&lt;bdo constructor&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo toString>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo X>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo x>a</bdo>')), [['<span class="invalid">&lt;bdo x&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir>a</bdo>')), [['<span class="invalid">&lt;bdo dir&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=rtl>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=">a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir="">a</bdo>')), [['<span class="invalid">&lt;bdo dir=""&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" dir="rtl">a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl" dir="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo diR="rtl">a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" >a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl"  >a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo  dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr\n>')), undefined);
      assert.deepStrictEqual(inspect(parser('<wbr >')), [['<wbr'], ' >']);
      assert.deepStrictEqual(inspect(parser('<wbr constructor>')), [['<wbr'], ' constructor>']);
      assert.deepStrictEqual(inspect(parser('<wbr X>')), [['<wbr'], ' X>']);
      assert.deepStrictEqual(inspect(parser('<wbr x>')), [['<wbr'], ' x>']);
    });

  });

});
