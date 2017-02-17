import { loop } from '../../parser/loop';
import { link } from './link';
import { inspect } from '../debug.test';

describe('Unit: syntax/link', () => {
  describe('link', () => {
    it('xss', () => {
      const parser = loop(link);
      assert.deepStrictEqual(inspect(parser('[](javascript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](vbscript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](any:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](a")')), [['<a href="a%22">a%22</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](a\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](")')), [['<a href="%22">%22</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("a)')), [['<a href="%22a">%22a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]("\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](a)')), [['<a href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\")')), [['<a href="%22">%22</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\)')), [['<a href="%5C">%5C</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\a)')), [['<a href="%5Ca">%5Ca</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](\\\\")')), [['<a href="%5C%22">%5C%22</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<img>](#)')), [['<a href="#">&lt;img&gt;</a>'], '']);
    })

    it('invalid', () => {
      const parser = loop(link);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('[]()')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ]()')), void 0);
      assert.deepStrictEqual(inspect(parser('[]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('[ ]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('[#]()')), void 0);
      assert.deepStrictEqual(inspect(parser('a[](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](#)')), void 0);
    });

    it('ab', () => {
      const parser = loop(link);
      assert.deepStrictEqual(inspect(parser('[](b)')), [['<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]( b)')), [['<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[](b )')), [['<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]( b )')), [['<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a](b)')), [['<a href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[ a](b)')), [['<a href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a ](b)')), [['<a href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[ a ](b)')), [['<a href="b">a</a>'], '']);
    });

    it('image', () => {
      const parser = loop(link);
      assert.deepStrictEqual(inspect(parser('[![a](b)](c)')), [['<a href="c"><img data-src="b" alt="a"></a>'], '']);
    });

    it('nest', () => {
      const parser = loop(link);
      assert.deepStrictEqual(inspect(parser('[\\[](#)')), [['<a href="#">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[<u>"]("?"#")')), [['<a href="%22?%22#%22">&lt;u&gt;"</a>'], '']);
    });

    it('external', () => {
      const parser = loop(link);
      assert.deepStrictEqual(inspect(parser('[](//example.com)')), [['<a href="//example.com" target="_blank">//example.com</a>'], '']);
    });

  });

});
