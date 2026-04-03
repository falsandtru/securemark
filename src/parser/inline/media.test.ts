import { media } from './media';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = some(media);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{javascript:alert}')), [['<img class="invalid" alt="javascript:alert">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{vbscript:alert}')), [['<img class="invalid" alt="vbscript:alert">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}')), [['<img class="invalid" alt="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{any:alert}')), [['<img class="invalid" alt="any:alert">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{"}')), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\}')), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![\\"]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('!{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{ }')), [['<span class="invalid">![]{ }</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{  }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{   }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]]{/}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{{}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{{b}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{b\nc}')), [['<span class="invalid">![]{b</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('![]{b\\\nc}')), [['<span class="invalid">![]{b\\</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b}')), [['<span class="invalid">![]{ b}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b\n}')), [['<span class="invalid">![]{ b</span>'], '\n}']);
      assert.deepStrictEqual(inspect(parser, input('![ ]{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![  ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ a]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ a ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\\ a]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ \\ a]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\n]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\\ ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\\\n]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![&Tab;]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![&a;]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;a;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![[]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![a]{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![a\nb]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![a\\\nb]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{ttp://host}')), [['<img class="invalid" alt="ttp://host">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{tel:1234567890}')), [['<img class="invalid" alt="tel:1234567890">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{http://[::ffff:0:0%1]}')), [['<img class="invalid" alt="http://[::ffff:0:0%1]">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{http://[::ffff:0:0/96]}')), [['<img class="invalid" alt="http://[::ffff:0:0/96]">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{.}')), [['<img class="invalid" alt=".">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{..}')), [['<img class="invalid" alt="..">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{../}')), [['<img class="invalid" alt="../">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/../b}')), [['<img class="invalid" alt="/../b">'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ![]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{/}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{b }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{b  }')), [['<span class="invalid">![]{b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b }')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b  }')), [['<span class="invalid">![]{ b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('![]{  b }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{  b  }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{"}')), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{"}"}')), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '"}']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\}')), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\ }')), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\b}')), [['<a href="\\b" target="_blank"><img class="media" data-src="\\b" alt="\\b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{?/../}')), [[`<a href="?/../" target="_blank"><img class="media" data-src="?/../" alt="?/../"></a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{#/../}')), [[`<a href="#/../" target="_blank"><img class="media" data-src="#/../" alt="#/../"></a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{^/b}')), [[`<a href="/b" target="_blank"><img class="media" data-src="/b" alt="^/b"></a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('![a ]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![a  ]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![a b]{c}')), [['<a href="c" target="_blank"><img class="media" data-src="c" alt="a b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![&copy;]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="©"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![&amp;copy;]{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;copy;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!{b}')), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!{ ][ }')), [['<a href="][" target="_blank"><img class="media" data-src="][" alt="]["></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!{ }{ }')), [['<a href="}{" target="_blank"><img class="media" data-src="}{" alt="}{"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('![\\[]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="["></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![\\"]{"?"#"}')), [['<a href="&quot;?&quot;#&quot;" target="_blank"><img class="media" data-src="&quot;?&quot;#&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![*a*]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="*a*"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![<wbr>]{/}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&lt;wbr&gt;"></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{//host}')), [['<a href="//host" target="_blank"><img class="media" data-src="//host" alt="//host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{//[::]}')), [['<a href="//[::]" target="_blank"><img class="media" data-src="//[::]" alt="//[::]"></a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{/ __proto__}')), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ constructor}')), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ aspect-ratio}')), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ nofollow}')), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ width="4" height="3"}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ 4x3}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ aspect-ratio="4/3"}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ aspect-ratio="4/3" nofollow}')), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ 4:3}')), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
    });

  });

});
