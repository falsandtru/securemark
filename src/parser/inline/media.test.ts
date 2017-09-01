import { loop } from '../../combinator/loop';
import { media } from './media';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = loop(media);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![](javascript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](vbscript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](data-type="image" data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](any:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](#")')), [['<img data-src="#&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](#\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](")')), [['<img data-src="&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("#)')), [['<img data-src="&quot;#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](\\#)')), [['<img data-src="#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\")')), [['<img data-src="&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\)')), [['<img data-src="\\" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\#)')), [['<img data-src="\\#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\")')), [['<img data-src="\\&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('!["](#)')), [['<img data-src="#" alt="&quot;">'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"](#)')), [['<img data-src="#" alt="&quot;">'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('![]()')), void 0);
      assert.deepStrictEqual(inspect(parser('![ ]()')), void 0);
      assert.deepStrictEqual(inspect(parser('![]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('![ ]( )')), void 0);
      assert.deepStrictEqual(inspect(parser('![]( #)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](# )')), void 0);
      assert.deepStrictEqual(inspect(parser('![]( # )')), void 0);
      assert.deepStrictEqual(inspect(parser('![](# #)')), void 0);
      assert.deepStrictEqual(inspect(parser('![#]()')), void 0);
      assert.deepStrictEqual(inspect(parser('![a\nb](ab)')), void 0);
      assert.deepStrictEqual(inspect(parser('![a\\\nb](ab)')), void 0);
      assert.deepStrictEqual(inspect(parser('![ab](a\nb)')), void 0);
      assert.deepStrictEqual(inspect(parser('![ab](a\\\nb)')), void 0);
      assert.deepStrictEqual(inspect(parser('a![](#)')), void 0);
      assert.deepStrictEqual(inspect(parser('[](#)')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('![](b)')), [['<img data-src="b" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![a](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![a b](c)')), [['<img data-src="c" alt="a b">'], '']);
      assert.deepStrictEqual(inspect(parser('![ a](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![a ](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![ a ](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![]\n(b)')), [['<img data-src="b" alt="">'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![\\[](#)')), [['<img data-src="#" alt="[">'], '']);
      assert.deepStrictEqual(inspect(parser('![<wbr>"]("?"#")')), [['<img data-src="&quot;?&quot;#&quot;" alt="<wbr>&quot;">'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![](//example.com)')), [['<img data-src="//example.com" alt="">'], '']);
    });

  });

});
