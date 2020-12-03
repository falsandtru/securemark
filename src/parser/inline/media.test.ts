import { media } from './media';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = (source: string) => some(media)(source, {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![]{javascript:alert}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{vbscript:alert}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{any:alert}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{"}')), [['<a href="&quot;" rel="noopener" target="_blank"><img class="media" data-src="&quot;" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\}')), [['<a href="\\" rel="noopener" target="_blank"><img class="media" data-src="\\" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{/}')), [['<a href="/" rel="noopener" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{/}')), [['<a href="/" rel="noopener" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('{}')), undefined);
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('!{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{  }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{   }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{/  }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{/ /}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]]{/}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{a  }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ a}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ a\n}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{a\nb}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{a\\\nb}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{a}}')), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]{#}')), undefined);
      assert.deepStrictEqual(inspect(parser('![  ]{#}')), undefined);
      assert.deepStrictEqual(inspect(parser('![\\ ]{#}')), undefined);
      assert.deepStrictEqual(inspect(parser('![a]{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![ a]{#}')), undefined);
      assert.deepStrictEqual(inspect(parser('![ a ]{#}')), undefined);
      assert.deepStrictEqual(inspect(parser('![\\ a ]{#}')), undefined);
      assert.deepStrictEqual(inspect(parser('![a\nb]{ab}')), undefined);
      assert.deepStrictEqual(inspect(parser('![a\\\nb]{ab}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ttp://host}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{tel:1234567890}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{http://[::ffff:0:0/96]}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('![]{b}')), [['<a href="b" rel="noopener" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{b }')), [['<a href="b" rel="noopener" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{ b }')), [['<a href="b" rel="noopener" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\}')), [['<a href="\\" rel="noopener" target="_blank"><img class="media" data-src="\\" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\ }')), [['<a href="\\" rel="noopener" target="_blank"><img class="media" data-src="\\" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\b}')), [['<a href="\\b" rel="noopener" target="_blank"><img class="media" data-src="\\b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{a b}')), [['<a href="a" rel="noopener" class="invalid" target="_blank"><img class="media invalid" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{./b}')), [['<a href="./b" rel="noopener" target="_blank"><img class="media" data-src="./b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{^/b}')), [[`<a href="${location.pathname}/b" rel="noopener" target="_blank"><img class="media" data-src="${location.pathname}/b" alt=""></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![a ]{b}')), [['<a href="b" rel="noopener" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a b]{c}')), [['<a href="c" rel="noopener" target="_blank"><img class="media" data-src="c" alt="a b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{b}')), [['<a href="b" rel="noopener" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{ ][ }')), [['<a href="][" rel="noopener" target="_blank"><img class="media" data-src="][" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{ }{ }')), [['<a href="}{" rel="noopener" target="_blank"><img class="media" data-src="}{" alt=""></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![\\[]{/}')), [['<a href="/" rel="noopener" target="_blank"><img class="media" data-src="/" alt="["></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{"?"#"}')), [['<a href="&quot;?&quot;#&quot;" rel="noopener" target="_blank"><img class="media" data-src="&quot;?&quot;#&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![<wbr>]{/}')), [['<a href="/" rel="noopener" target="_blank"><img class="media" data-src="/" alt="<wbr>"></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![]{//host}')), [['<a href="//host" rel="noopener" target="_blank"><img class="media" data-src="//host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{//[::]}')), [['<a href="//[::]" rel="noopener" target="_blank"><img class="media" data-src="//[::]" alt=""></a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('![]{/ nofollow}')), [['<a href="/" rel="noopener nofollow noreferrer" target="_blank"><img class="media" data-src="/" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ constructor}')), [['<a href="/" rel="noopener" class="invalid" target="_blank"><img class="media invalid" data-src="/" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{/ nofollow}')), [['<a href="/" rel="noopener nofollow noreferrer" target="_blank"><img class="media" data-src="/" alt=""></a>'], '']);
    });

  });

});
