import { loop } from '../../combinator/loop';
import { html } from './html';
import { inspect } from '../debug.test';

describe('Unit: parser/html', () => {
  describe('html', () => {
    const parser = loop(html);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), void 0);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), void 0);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), void 0);
      assert.deepStrictEqual(inspect(parser('<script src="."></script>')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby onclick="alert()">')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby onclick="alert()"><ruby>')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby><ruby onclick="alert()"></ruby></ruby>')), [['<ruby>&lt;ruby onclick="alert()"&gt;</ruby>'], '</ruby>']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby>')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby>a')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby>a</RUBY>')), void 0);
      assert.deepStrictEqual(inspect(parser('<RUBY>a</ruby>')), void 0);
      assert.deepStrictEqual(inspect(parser('<RUBY>a</RUBY>')), void 0);
      assert.deepStrictEqual(inspect(parser('</ruby>')), void 0);
      assert.deepStrictEqual(inspect(parser('a')), void 0);
      assert.deepStrictEqual(inspect(parser('a<ruby>')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('<ruby></ruby>')), [['<ruby></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a</ruby>')), [['<ruby>a</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a</ruby>a')), [['<ruby>a</ruby>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<ruby>\n</ruby>')), [['<ruby></ruby>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<ruby><ruby></ruby></ruby>')), [['<ruby><ruby></ruby></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a<ruby>b</ruby>c</ruby>')), [['<ruby>a<ruby>b</ruby>c</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>`a`</ruby>')), [['<ruby><code>a</code></ruby>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby><a></a></ruby>')), [['<ruby>&lt;a&gt;&lt;/a&gt;</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a<a>b</a>c</ruby>')), [['<ruby>a&lt;a&gt;b&lt;/a&gt;c</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby><img></ruby>')), [['<ruby>&lt;img&gt;</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), void 0);
      assert.deepStrictEqual(inspect(parser('<ruby><img /></ruby>')), [['<ruby>&lt;img /&gt;</ruby>'], '']);
    });

    it('code', () => {
      assert.deepStrictEqual(inspect(parser('<code>`</code>')), [['<code>`</code>'], '']);
      assert.deepStrictEqual(inspect(parser('<code> \\ </code>')), [['<code> \\ </code>'], '']);
      assert.deepStrictEqual(inspect(parser('<code> \\\\ </code>')), [['<code> \\\\ </code>'], '']);
    });

    it('wbr', () => {
      assert.deepStrictEqual(inspect(parser('<wbr>a')), [['<wbr>'], 'a']);
    });

  });

});
