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
      assert.deepStrictEqual(inspect(parser('<u onclick="alert()">')), void 0);
      assert.deepStrictEqual(inspect(parser('<u onclick="alert()"><u>')), void 0);
      assert.deepStrictEqual(inspect(parser('<u><u onclick="alert()"></u></u>')), [['<u>&lt;u onclick="alert()"&gt;</u>'], '</u>']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('</u>')), void 0);
      assert.deepStrictEqual(inspect(parser('a')), void 0);
      assert.deepStrictEqual(inspect(parser('a<u>')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('<u>')), [['<u></u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>a')), [['<u>a</u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u><u>')), [['<u><u></u></u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u></u>')), [['<u></u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>a</u>')), [['<u>a</u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>a</u>a')), [['<u>a</u>'], 'a']);
      assert.deepStrictEqual(inspect(parser('<u>\n</u>')), [['<u></u>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('<u><u></u></u>')), [['<u><u></u></u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>a<u>b</u>c</u>')), [['<u>a<u>b</u>c</u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>`a`</u>')), [['<u><code>a</code></u>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('<a>')), void 0);
      assert.deepStrictEqual(inspect(parser('<u><a></a></u>')), [['<u>&lt;a&gt;&lt;/a&gt;</u>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>a<a>b</a>c</u>')), [['<u>a&lt;a&gt;b&lt;/a&gt;c</u>'], '']);
      assert.deepStrictEqual(inspect(parser('<img>')), void 0);
      assert.deepStrictEqual(inspect(parser('<u><img></u>')), [['<u>&lt;img&gt;</u>'], '']);
      assert.deepStrictEqual(inspect(parser('<img />')), void 0);
      assert.deepStrictEqual(inspect(parser('<u><img /></u>')), [['<u>&lt;img /&gt;</u>'], '']);
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
