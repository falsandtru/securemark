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
      assert.deepStrictEqual(inspect(parser('<var onclick="alert()">')), void 0);
      assert.deepStrictEqual(inspect(parser('<var onclick="alert()"><var>')), void 0);
      assert.deepStrictEqual(inspect(parser('<var><var onclick="alert()"></var></var>')), [['<var>&lt;var onclick=<q>alert()</q>&gt;</var>'], '</var>']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('<var>')), void 0);
      assert.deepStrictEqual(inspect(parser('<var>a')), void 0);
      assert.deepStrictEqual(inspect(parser('</var>')), void 0);
      assert.deepStrictEqual(inspect(parser('a')), void 0);
      assert.deepStrictEqual(inspect(parser('a<var>')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('<var></var>')), [['<var></var>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>a</var>')), [['<var>a</var>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>a</var>a')), [['<var>a</var>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<var>\n</var>')), [['<var></var>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<var><var></var></var>')), [['<var><var></var></var>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>a<var>b</var>c</var>')), [['<var>a<var>b</var>c</var>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>`a`</var>')), [['<var><code>a</code></var>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), void 0);
      assert.deepStrictEqual(inspect(parser('<var><a></a></var>')), [['<var>&lt;a&gt;&lt;/a&gt;</var>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>a<a>b</a>c</var>')), [['<var>a&lt;a&gt;b&lt;/a&gt;c</var>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), void 0);
      assert.deepStrictEqual(inspect(parser('<var><img></var>')), [['<var>&lt;img&gt;</var>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), void 0);
      assert.deepStrictEqual(inspect(parser('<var><img /></var>')), [['<var>&lt;img /&gt;</var>'], '']);
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
