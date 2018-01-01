import { media } from './media';
import { loop } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = loop(media);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![](javascript:alert)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](vbscript:alert)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](data-type="image" data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](any:alert)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](#")')), [['<img data-src="#&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](#\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](")')), [['<img data-src="&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("#)')), [['<img data-src="&quot;#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]("\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](\\)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](\\#)')), [['<img data-src="#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\")')), [['<img data-src="&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\)')), [['<img data-src="\\" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\#)')), [['<img data-src="\\#" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](\\\\")')), [['<img data-src="\\&quot;" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('!["](#)')), [['<img data-src="#" alt="&quot;">'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"](#)')), [['<img data-src="#" alt="&quot;">'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('![]()')), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]()')), undefined);
      assert.deepStrictEqual(inspect(parser('![]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]( )')), undefined);
      assert.deepStrictEqual(inspect(parser('![]( #)')), undefined);
      assert.deepStrictEqual(inspect(parser('![](# )')), undefined);
      assert.deepStrictEqual(inspect(parser('![]( # )')), undefined);
      assert.deepStrictEqual(inspect(parser('![](# #)')), undefined);
      assert.deepStrictEqual(inspect(parser('![]](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('![#]()')), undefined);
      assert.deepStrictEqual(inspect(parser('![a\nb](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('![a\\\nb](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('![*a\\](\nb*](ab)')), undefined);
      assert.deepStrictEqual(inspect(parser('![ab](a\nb)')), undefined);
      assert.deepStrictEqual(inspect(parser('![ab](a\\\nb)')), undefined);
      assert.deepStrictEqual(inspect(parser('![ab]((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('a![](#)')), undefined);
      assert.deepStrictEqual(inspect(parser('[](#)')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('![](b)')), [['<img data-src="b" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![a](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![a b](c)')), [['<img data-src="c" alt="a b">'], '']);
      assert.deepStrictEqual(inspect(parser('![a ](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![ a](b)')), [['<img data-src="b" alt="a">'], '']);
      assert.deepStrictEqual(inspect(parser('![ a ](b)')), [['<img data-src="b" alt="a">'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![](#())')), [['<img data-src="#()" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](#(()))')), [['<img data-src="#(())" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](#(a(b)()(c)d))')), [['<img data-src="#(a(b)()(c)d)" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![\\[](#)')), [['<img data-src="#" alt="[">'], '']);
      assert.deepStrictEqual(inspect(parser('![<wbr>"]("?"#")')), [['<img data-src="&quot;?&quot;#&quot;" alt="<wbr>&quot;">'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![](//host)')), [['<img data-src="//host" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![](//[::])')), [['<img data-src="//[::]" alt="">'], '']);
    });

  });

});
