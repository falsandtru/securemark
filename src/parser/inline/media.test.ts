import { media } from './media';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = (source: string) => some(media)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('![]{javascript:alert}'), ctx), [['<img class="invalid" alt="javascript:alert">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{vbscript:alert}'), ctx), [['<img class="invalid" alt="vbscript:alert">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}'), ctx), [['<img class="invalid" alt="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{any:alert}'), ctx), [['<img class="invalid" alt="any:alert">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{"}'), ctx), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\}'), ctx), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{/}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('!{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{  }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{   }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]]{/}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{{b}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{b\nc}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{a\\\nc}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ b\n}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![ ]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![  ]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![\n]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![\\ ]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![\\\n]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![&Tab;]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![&a;]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;a;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![[]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![a]{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![a\nb]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![a\\\nb]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{ttp://host}'), ctx), [['<img class="invalid" alt="ttp://host">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{tel:1234567890}'), ctx), [['<img class="invalid" alt="tel:1234567890">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{http://[::ffff:0:0%1]}'), ctx), [['<img class="invalid" alt="http://[::ffff:0:0%1]">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{http://[::ffff:0:0/96]}'), ctx), [['<img class="invalid" alt="http://[::ffff:0:0/96]">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{.}'), ctx), [['<img class="invalid" alt=".">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{..}'), ctx), [['<img class="invalid" alt="..">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{../}'), ctx), [['<img class="invalid" alt="../">'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/../b}'), ctx), [['<img class="invalid" alt="/../b">'], '']);
      assert.deepStrictEqual(inspect(parser(' ![]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{/}'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('![]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{b }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{b  }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{ b }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{ b  }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{  b }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{  b  }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{  b   }'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{"}'), ctx), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{"}"}'), ctx), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '"}']);
      assert.deepStrictEqual(inspect(parser('![]{\\}'), ctx), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\ }'), ctx), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{\\b}'), ctx), [['<a href="\\b" target="_blank"><img class="media" data-src="\\b" alt="\\b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{?/../}'), ctx), [[`<a href="?/../" target="_blank"><img class="media" data-src="?/../" alt="?/../"></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![]{#/../}'), ctx), [[`<a href="#/../" target="_blank"><img class="media" data-src="#/../" alt="#/../"></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![]{^/b}'), ctx), [[`<a href="/b" target="_blank"><img class="media" data-src="/b" alt="^/b"></a>`], '']);
      assert.deepStrictEqual(inspect(parser('![ a]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![ a ]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a ]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a  ]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![a b]{c}'), ctx), [['<a href="c" target="_blank"><img class="media" data-src="c" alt="a b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![&copy;]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="©"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![&amp;copy;]{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;copy;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{b}'), ctx), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{ ][ }'), ctx), [['<a href="][" target="_blank"><img class="media" data-src="][" alt="]["></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{ }{ }'), ctx), [['<a href="}{" target="_blank"><img class="media" data-src="}{" alt="}{"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('![\\[]{/}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="["></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![\\"]{"?"#"}'), ctx), [['<a href="&quot;?&quot;#&quot;" target="_blank"><img class="media" data-src="&quot;?&quot;#&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![*a*]{/}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="*a*"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![<wbr>]{/}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&lt;wbr&gt;"></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('![]{//host}'), ctx), [['<a href="//host" target="_blank"><img class="media" data-src="//host" alt="//host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{//[::]}'), ctx), [['<a href="//[::]" target="_blank"><img class="media" data-src="//[::]" alt="//[::]"></a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('![]{/ __proto__}'), ctx), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ constructor}'), ctx), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ aspect-ratio}'), ctx), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ nofollow}'), ctx), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ width="4" height="3"}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ 4x3}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ aspect-ratio="4/3"}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ aspect-ratio="4/3" nofollow}'), ctx), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{/ 4:3}'), ctx), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
    });

  });

});
