import { media } from './media';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = (source: string) => some(media)({ source, context: {} });

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![]{javascript:alert}')), [['<img class="media invalid" data-src="javascript:alert" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{vbscript:alert}')), [['<img class="media invalid" data-src="vbscript:alert" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}')), [['<img class="media invalid" data-src="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{any:alert}')), [['<img class="media invalid" data-src="any:alert" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{"}')), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\}')), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('{}')), undefined);
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('!{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{  }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{   }')), undefined);
      assert.deepStrictEqual(inspect(parser('![]]{/}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{b}}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{b\nc}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{a\\\nc}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ b\n}')), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![  ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![\n]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![\\ ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![\\\n]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![&Tab;]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![&a;]{b}')), [['<img class="media invalid" data-src="b" alt="&amp;a;">'], '']);
      assert.deepStrictEqual(inspect(parser('![[]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![a]{}')), undefined);
      assert.deepStrictEqual(inspect(parser('![a\nb]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![a\\\nb]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ttp://host}')), [['<img class="media invalid" data-src="ttp://host" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{tel:1234567890}')), [['<img class="media invalid" data-src="tel:1234567890" alt="">'], '']);
      //assert.deepStrictEqual(inspect(parser('![]{http://[::ffff:0:0%1]}')), [['<img class="media invalid" alt="">'], '']);
      //assert.deepStrictEqual(inspect(parser('![]{http://[::ffff:0:0/96]}')), [['<img class="media invalid" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{.}')), [['<img class="media invalid" data-src="." alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{..}')), [['<img class="media invalid" data-src=".." alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{../}')), [['<img class="media invalid" data-src="../" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/../b}')), [['<img class="media invalid" data-src="/../b" alt="">'], '']);
      assert.deepStrictEqual(inspect(parser(' ![]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser('[]{/}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('![]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{b }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{b  }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{ b }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{ b  }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{  b }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{  b  }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{  b   }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\}')), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\ }')), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\b}')), [['<a href="\\b" target="_blank"><img class="media" data-src="\\b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{?/../}')), [[`<a href="?/../" target="_blank"><img class="media" data-src="?/../" alt=""></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![]{#/../}')), [[`<a href="#/../" target="_blank"><img class="media" data-src="#/../" alt=""></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![]{^/b}')), [[`<a href="/b" target="_blank"><img class="media" data-src="/b" alt=""></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![ a]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![ a ]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a ]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a  ]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a b]{c}')), [['<a href="c" target="_blank"><img class="media" data-src="c" alt="a b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![&copy;]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="©"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![&amp;copy;]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;copy;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{ ][ }')), [['<a href="][" target="_blank"><img class="media" data-src="][" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{ }{ }')), [['<a href="}{" target="_blank"><img class="media" data-src="}{" alt=""></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![\\[]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="["></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{"?"#"}')), [['<a href="&quot;?&quot;#&quot;" target="_blank"><img class="media" data-src="&quot;?&quot;#&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![*a*]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="*a*"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![<wbr>]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="<wbr>"></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![]{//host}')), [['<a href="//host" target="_blank"><img class="media" data-src="//host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{//[::]}')), [['<a href="//[::]" target="_blank"><img class="media" data-src="//[::]" alt=""></a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('![]{/ __proto__}')), [['<a href="/" target="_blank"><img class="media invalid" data-src="/" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ constructor}')), [['<a href="/" target="_blank"><img class="media invalid" data-src="/" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ aspect-ratio}')), [['<a href="/" target="_blank"><img class="media invalid" data-src="/" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ nofollow}')), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ width="4" height="3"}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ 4x3}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ aspect-ratio="4/3"}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ aspect-ratio="4/3" nofollow}')), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ 4:3}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
    });

  });

});
