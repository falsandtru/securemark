import { loop } from '../../combinator';
import { html } from './html';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/html', () => {
  describe('html', () => {
    const parser = loop(html);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()<script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script>alert()</script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<script src="."></script>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby></ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby> </ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby>\n</ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby onclick="alert()">')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby onclick="alert()"><ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby><ruby onclick="alert()"></ruby></ruby>')), [['<ruby>&lt;ruby onclick="alert()"&gt;</ruby>'], '</ruby>']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby>a')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby>a</RUBY>')), undefined);
      assert.deepStrictEqual(inspect(parser('<RUBY>a</ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('<RUBY>a</RUBY>')), undefined);
      assert.deepStrictEqual(inspect(parser('</ruby>')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
      assert.deepStrictEqual(inspect(parser('a<ruby>')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('<ruby>a</ruby>')), [['<ruby>a</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a</ruby>a')), [['<ruby>a</ruby>'], 'a']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<ruby><ruby>a</ruby></ruby>')), [['<ruby><ruby>a</ruby></ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a<ruby>b</ruby>c</ruby>')), [['<ruby>a<ruby>b</ruby>c</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>`a`</ruby>')), [['<ruby><code data-src="`a`">a</code></ruby>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby><a></a></ruby>')), [['<ruby>&lt;a&gt;&lt;/a&gt;</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>a<a>b</a>c</ruby>')), [['<ruby>a&lt;a&gt;b&lt;/a&gt;c</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby><img></ruby>')), [['<ruby>&lt;img&gt;</ruby>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), undefined);
      assert.deepStrictEqual(inspect(parser('<ruby><img /></ruby>')), [['<ruby>&lt;img /&gt;</ruby>'], '']);
    });

    it('wbr', () => {
      assert.deepStrictEqual(inspect(parser('<wbr>a')), [['<wbr>'], 'a']);
    });

  });

});
