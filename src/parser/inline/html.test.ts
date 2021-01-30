import { html } from './html';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = (source: string) => some(html)(source, {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), [['<span class="invalid">&lt;script&gt;alert()&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script src="\\""></script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small onclick="alert()">')), undefined);
      assert.deepStrictEqual(inspect(parser('<small onclick="alert()"></small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small onclick="alert()">a</small>')), [['<span class="invalid">&lt;small onclick="alert()"&gt;a&lt;/small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small><small onclick="alert()">a</small></small>')), [['<small><span class="invalid">&lt;small onclick="alert()"&gt;a&lt;/small&gt;</span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl\\"><">a</bdo>')), [['<span class="invalid">&lt;bdo dir="rtl\\"&gt;&lt;"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr onclick="alert()">')), [['<wbr class="invalid">'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<0>')), undefined);
      assert.deepStrictEqual(inspect(parser('<aT>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a,b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a, b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<T>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small></small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>a  </small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small> </small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small> a</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small> a </small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>\n</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>\na</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>\\ a</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>\\\na</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><wbr></small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>a')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>a</BDO>')), undefined);
      assert.deepStrictEqual(inspect(parser('<SMALL>a</SMALL>')), undefined);
      assert.deepStrictEqual(inspect(parser('<SMALL>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('</small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small/>')), undefined);
      assert.deepStrictEqual(inspect(parser('<b><b><b>a</b></b></b>z')), [['<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;<span class="invalid">&lt;b&gt;a&lt;/b&gt;</span>&lt;/b&gt;</span>&lt;/b&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<small><small><small>a</small></small></small>z')), [['<small><span class="invalid">&lt;small&gt;<span class="invalid">&lt;small&gt;a&lt;/small&gt;</span>&lt;/small&gt;</span></small>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<x a="*b*"')), undefined);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">')), undefined);
      assert.deepStrictEqual(inspect(parser('<x a="*b*">c')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a="*b*"')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a="*b*">')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a="*b*">c')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a b="*" *c*')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a b="*" *c*>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a b="*" *c*>d</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a b="*" *>*c*')), undefined);
      assert.deepStrictEqual(inspect(parser('<small a b="*" *>*c*</small>z')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<small>a</small>')), [['<small>a</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a</small>a')), [['<small>a</small>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<small>a </small>')), [['<small>a </small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a\nb</small>')), [['<small>a<br>b</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>a')), [['<wbr>'], 'a']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<small><small>a</small></small>')), [['<small><span class="invalid">&lt;small&gt;a&lt;/small&gt;</span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a<small>b</small>c</small>')), [['<small>a<span class="invalid">&lt;small&gt;b&lt;/small&gt;</span>c</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>`a`</small>')), [['<small><code data-src="`a`">a</code></small>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><a>a</a></small>')), [['<small><span class="invalid">&lt;a&gt;a&lt;/a&gt;</span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a<a>b</a>c</small>')), [['<small>a<span class="invalid">&lt;a&gt;b&lt;/a&gt;</span>c</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><img></small>')), [['<small>&lt;img&gt;</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><img /></small>')), [['<small>&lt;img /&gt;</small>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('<small constructor>a</small>z')), [['<span class="invalid">&lt;small constructor&gt;a&lt;/small&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<small toString>a</small>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo>a</bdo>z')), [['<span class="invalid">&lt;bdo&gt;a&lt;/bdo&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<bdo >a</bdo>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo constructor>a</bdo>z')), [['<span class="invalid">&lt;bdo constructor&gt;a&lt;/bdo&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<bdo toString>a</bdo>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir>a</bdo>z')), [['<span class="invalid">&lt;bdo dir&gt;a&lt;/bdo&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=>a</bdo>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=rtl>a</bdo>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=">a</bdo>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir="">a</bdo>z')), [['<span class="invalid">&lt;bdo dir=""&gt;a&lt;/bdo&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" dir="rtl">a</bdo>z')), [['<span class="invalid">&lt;bdo dir="rtl" dir="rtl"&gt;a&lt;/bdo&gt;</span>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl">a</bdo>z')), [['<bdo dir="rtl">a</bdo>'], 'z']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" >a</bdo>z')), undefined);
      assert.deepStrictEqual(inspect(parser('<wbr constructor>z')), [['<wbr class="invalid">'], 'z']);
    });

  });

});
