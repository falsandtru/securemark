import { loop } from '../../combinator/loop';
import { media } from './media';
import { inspect } from '../debug.test';

describe('Unit: parser/media', () => {
  describe('media', () => {
    const parser = loop(media);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![](javascript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](vbscript:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](any:alert)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](#")')), [['<img class="media" data-src="#&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](#\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](")')), [['<img class="media" data-src="&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("#)')), [['<img class="media" data-src="&quot;#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](\\)')), void 0);
      assert.deepStrictEqual(inspect(parser('![](\\#)')), [['<img class="media" data-src="#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\")')), [['<img class="media" data-src="&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\)')), [['<img class="media" data-src="\\" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\#)')), [['<img class="media" data-src="\\#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\")')), [['<img class="media" data-src="\\&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('!["](#)')), [['<img class="media" data-src="#" alt="&quot;">'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"](#)')), [['<img class="media" data-src="#" alt="&quot;">'], '']);
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
      assert.deepStrictEqual(inspect(parser('![](b)')), [['<img class="media" data-src="b" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![a](b)')), [['<img class="media" data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![a b](c)')), [['<img class="media" data-src="c" alt="a b">'], '']);
      assert.deepStrictEqual(inspect(parser('![ a](b)')), [['<img class="media" data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![a ](b)')), [['<img class="media" data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![ a ](b)')), [['<img class="media" data-src="b" alt="a">'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![\\[](#)')), [['<img class="media" data-src="#" alt="[">'], '']);
      assert.deepStrictEqual(inspect(parser('![<wbr>"]("?"#")')), [['<img class="media" data-src="&quot;?&quot;#&quot;" alt="<wbr>&quot;">'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![](//example.com)')), [['<img class="media" data-src="//example.com" alt="">'], '']);
    });

  });

});
