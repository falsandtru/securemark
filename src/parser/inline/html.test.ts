import { html } from './html';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = (source: string) => some(html)(source, {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;script&gt;</span>'], 'alert()<script>']);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;script&gt;alert()&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<script src="."></script>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;script src="."&gt;&lt;/script&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small onclick="alert()">')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small onclick="alert()"&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small onclick="alert()"></small>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small onclick="alert()"&gt;&lt;/small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small><small onclick="alert()"></small></small>')), [['<small><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small onclick="alert()"&gt;&lt;/small&gt;</span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl\\"><">a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo dir="rtl\\"&gt;&lt;"&gt;a&lt;/bdo&gt;</span>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<0>')), undefined);
      assert.deepStrictEqual(inspect(parser('<aT>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a,b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<a, b>')), undefined);
      assert.deepStrictEqual(inspect(parser('<T>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small></small>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small&gt;&lt;/small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small> </small>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small&gt; &lt;/small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>\n</small>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small&gt;\n&lt;/small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small&gt;</span>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<small>a</BDO>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small&gt;</span>'], 'a</BDO>']);
      assert.deepStrictEqual(inspect(parser('<SMALL>a</SMALL>')), undefined);
      assert.deepStrictEqual(inspect(parser('<SMALL>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('</small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small/>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small/&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small><small><small>a</small></small></small>')), [['<small><small>&lt;small&gt;a</small></small>'], '</small>']);
      assert.deepStrictEqual(inspect(parser('<b><b><b>a</b></b></b>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;b&gt;&lt;b&gt;&lt;b&gt;a&lt;/b&gt;&lt;/b&gt;</span>'], '</b>']);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
      assert.deepStrictEqual(inspect(parser('a<small>')), undefined);
      assert.deepStrictEqual(inspect(parser('a<small>b</small>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<small>a</small>')), [['<small>a</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a</small>a')), [['<small>a</small>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<small>a </small>')), [['<small>a </small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small> a</small>')), [['<small> a</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small> a </small>')), [['<small> a </small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>  a  </small>')), [['<small>  a  </small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>\na\n</small>')), [['<small><br>a<br></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small> \na \n</small>')), [['<small><br>a<br></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>\\\na\\\n</small>')), [['<small><span class="linebreak"> </span>a<span class="linebreak"> </span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a\nb</small>')), [['<small>a<br>b</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>a')), [['<wbr>'], 'a']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<small><small>a</small></small>')), [['<small><small>a</small></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a<small>b</small>c</small>')), [['<small>a<small>b</small>c</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>`a`</small>')), [['<small><code data-src="`a`">a</code></small>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;a&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small><a></a></small>')), [['<small><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;a&gt;&lt;/a&gt;</span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a<a>b</a>c</small>')), [['<small>a<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;a&gt;b&lt;/a&gt;</span>c</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;img&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small><img></small>')), [['<small><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;img&gt;</span></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;img /&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small><img /></small>')), [['<small><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;img /&gt;</span></small>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('<small constructor>a</small>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;small constructor&gt;a&lt;/small&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<small toString>a</small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo>a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo >a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo &gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo constructor>a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo constructor&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo toString>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir>a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo dir&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir=>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir=rtl>a</bdo>')), undefined);
      assert.deepStrictEqual(inspect(parser('<bdo dir="">a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo dir=""&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" dir="rtl">a</bdo>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;bdo dir="rtl" dir="rtl"&gt;a&lt;/bdo&gt;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" >a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr constructor>')), [['<span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;wbr constructor&gt;</span>'], '']);
    });

  });

});
