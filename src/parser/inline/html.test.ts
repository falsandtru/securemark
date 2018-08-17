import { html } from './html';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = some(html);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script src="."></script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby onclick="alert()">')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby onclick="alert()"><small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><ruby onclick="alert()"></small></small>')), [['<small>&lt;ruby onclick="alert()"&gt;</small>'], '</small>']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small></small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small> </small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>\n</small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>a')), undefined);
      assert.deepStrictEqual(inspect(parser('<small>a</RUBY>')), undefined);
      assert.deepStrictEqual(inspect(parser('<RUBY>a</small>')), undefined);
      assert.deepStrictEqual(inspect(parser('<RUBY>a</RUBY>')), undefined);
      assert.deepStrictEqual(inspect(parser('</small>')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
      assert.deepStrictEqual(inspect(parser('a<small>')), undefined);
      assert.deepStrictEqual(inspect(parser('a<small>b</small>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('<small>a</small>')), [['<small>a</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a</small>a')), [['<small>a</small>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<small>a\nb</small>')), [['<small>a<span class="linebreak"> <wbr></span>b</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<wbr>a')), [['<wbr>'], 'a']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<small><small>a</small></small>')), [['<small><small>a</small></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a<small>b</small>c</small>')), [['<small>a<small>b</small>c</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>`a`</small>')), [['<small><code data-src="`a`">a</code></small>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><a></a></small>')), [['<small>&lt;a&gt;&lt;/a&gt;</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>a<a>b</a>c</small>')), [['<small>a&lt;a&gt;b&lt;/a&gt;c</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><img></small>')), [['<small>&lt;img&gt;</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), undefined);
      assert.deepStrictEqual(inspect(parser('<small><img /></small>')), [['<small>&lt;img /&gt;</small>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('<small constructor>a</small>')), [['<small class="invalid">a</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo constructor>a</bdo>')), [['<bdo class="invalid">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl" dir="rtl">a</bdo>')), [['<bdo class="invalid" dir="rtl">a</bdo>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdo dir="rtl">a</bdo>')), [['<bdo dir="rtl">a</bdo>'], '']);
    });

  });

});
