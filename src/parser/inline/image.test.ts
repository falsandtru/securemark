import { loop } from '../../combinator/loop';
import { image } from './image';
import { inspect } from '../debug.test';

describe('Unit: parser/image', () => {
  describe('image', () => {
    const parser = loop(image);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![](javascript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](vbscript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](any:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](#")')), [['<img data-src="#%22" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](#\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](")')), [['<img data-src="%22" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("#)')), [['<img data-src="%22#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](\\#)')), [['<img data-src="#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\")')), [['<img data-src="%22" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\)')), [['<img data-src="%5C" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\#)')), [['<img data-src="%5C#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\")')), [['<img data-src="%5C%22" alt="">'], '']);
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
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![\\[](#)')), [['<img data-src="#" alt="[">'], '']);
      assert.deepStrictEqual(inspect(parser('![<var>"]("?"#")')), [['<img data-src="%22?%22#%22" alt="<var>&quot;">'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![](//example.com)')), [['<img data-src="//example.com" alt="">'], '']);
    });

  });

});
