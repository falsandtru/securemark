import { media } from './media';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/media', () => {
  describe('media', () => {
    const parser = some(media);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{javascript:alert}', new Context())), [['<img class="invalid" alt="javascript:alert">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{vbscript:alert}', new Context())), [['<img class="invalid" alt="vbscript:alert">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}', new Context())), [['<img class="invalid" alt="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{any:alert}', new Context())), [['<img class="invalid" alt="any:alert">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{"}', new Context())), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\}', new Context())), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![\\"]{/}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&quot;"></a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('!{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{ }', new Context())), [['<span class="invalid">![]{ }</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{  }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{   }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]]{/}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{{}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{{b}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{b\nc}', new Context())), [['<span class="invalid">![]{b</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('![]{b\\\nc}', new Context())), [['<span class="invalid">![]{b\\</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b}', new Context())), [['<span class="invalid">![]{ b}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b\n}', new Context())), [['<span class="invalid">![]{ b</span>'], '\n}']);
      assert.deepStrictEqual(inspect(parser, input('![ ]{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![  ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ a]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ a ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\\ a]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![ \\ a]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\n]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\\ ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![\\\n]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![&Tab;]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![&a;]{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;a;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![[]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![a]{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![a\nb]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![a\\\nb]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{ttp://host}', new Context())), [['<img class="invalid" alt="ttp://host">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{tel:1234567890}', new Context())), [['<img class="invalid" alt="tel:1234567890">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{http://[::ffff:0:0%1]}', new Context())), [['<img class="invalid" alt="http://[::ffff:0:0%1]">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{http://[::ffff:0:0/96]}', new Context())), [['<img class="invalid" alt="http://[::ffff:0:0/96]">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{.}', new Context())), [['<img class="invalid" alt=".">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{..}', new Context())), [['<img class="invalid" alt="..">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{../}', new Context())), [['<img class="invalid" alt="../">'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/../b}', new Context())), [['<img class="invalid" alt="/../b">'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ![]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{/}', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{b }', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{b  }', new Context())), [['<span class="invalid">![]{b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b }', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{ b  }', new Context())), [['<span class="invalid">![]{ b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('![]{  b }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{  b  }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{"}', new Context())), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{"}"}', new Context())), [['<a href="&quot;" target="_blank"><img class="media" data-src="&quot;" alt="&quot;"></a>'], '"}']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\}', new Context())), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\ }', new Context())), [['<a href="\\" target="_blank"><img class="media" data-src="\\" alt="\\"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{\\b}', new Context())), [['<a href="\\b" target="_blank"><img class="media" data-src="\\b" alt="\\b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{?/../}', new Context())), [[`<a href="?/../" target="_blank"><img class="media" data-src="?/../" alt="?/../"></a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{#/../}', new Context())), [[`<a href="#/../" target="_blank"><img class="media" data-src="#/../" alt="#/../"></a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{^/b}', new Context())), [[`<a href="/b" target="_blank"><img class="media" data-src="/b" alt="^/b"></a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('![a ]{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![a  ]{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![a b]{c}', new Context())), [['<a href="c" target="_blank"><img class="media" data-src="c" alt="a b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![&copy;]{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="©"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![&amp;copy;]{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="&amp;copy;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!{b}', new Context())), [['<a href="b" target="_blank"><img class="media" data-src="b" alt="b"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!{ ][ }', new Context())), [['<a href="][" target="_blank"><img class="media" data-src="][" alt="]["></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('!{ }{ }', new Context())), [['<a href="}{" target="_blank"><img class="media" data-src="}{" alt="}{"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('![\\[]{/}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="["></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![\\"]{"?"#"}', new Context())), [['<a href="&quot;?&quot;#&quot;" target="_blank"><img class="media" data-src="&quot;?&quot;#&quot;" alt="&quot;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![*a*]{/}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="*a*"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![<wbr>]{/}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="&lt;wbr&gt;"></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{//host}', new Context())), [['<a href="//host" target="_blank"><img class="media" data-src="//host" alt="//host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{//[::]}', new Context())), [['<a href="//[::]" target="_blank"><img class="media" data-src="//[::]" alt="//[::]"></a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('![]{/ __proto__}', new Context())), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ constructor}', new Context())), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ aspect-ratio}', new Context())), [['<a href="/" target="_blank"><img class="invalid" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ nofollow}', new Context())), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="/"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ width="4" height="3"}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ 4x3}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" width="4" height="3"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ aspect-ratio="4/3"}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ aspect-ratio="4/3" nofollow}', new Context())), [['<a href="/" rel="nofollow" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('![]{/ 4:3}', new Context())), [['<a href="/" target="_blank"><img class="media" data-src="/" alt="/" aspect-ratio="4/3" style="aspect-ratio: 4 / 3;"></a>'], '']);
    });

  });

});
