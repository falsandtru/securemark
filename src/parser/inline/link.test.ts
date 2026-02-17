import { LinkParser } from '../inline';
import { textlink, medialink } from './link';
import { some, union } from '../../combinator';
import { MarkdownParser } from '../../../markdown';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/link', () => {
  describe('link', () => {
    const link: LinkParser = union([
      medialink,
      textlink,
    ]);
    const parser = (source: string, opts: MarkdownParser.Options = {}) => some(link)(input(source, Object.assign(ctx, { host: undefined }, opts)));
    const { context: ctx } = input('', {});

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser('[]{javascript:alert}'), ctx), [['<a class="invalid">javascript:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{vbscript:alert}'), ctx), [['<a class="invalid">vbscript:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}'), ctx), [['<a class="invalid">data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{any:alert}'), ctx), [['<a class="invalid">any:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{"}'), ctx), [['<a class="url" href="&quot;">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{<}'), ctx), [['<a class="url" href="&lt;">&lt;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{\\}'), ctx), [['<a class="url" href="\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{\\"}'), ctx), [['<a class="url" href="\\&quot;">\\"</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{\\<}'), ctx), [['<a class="url" href="\\&lt;">\\&lt;</a>'], '']);
    });

    it('fishing', () => {
      assert.deepStrictEqual(inspect(parser('[http://host]{http://evil}'), ctx), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\http://host]{http://evil}'), ctx), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[https://host]{http://host}'), ctx), [['<a class="invalid">https://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[]{http://host}.com]{http://host}'), ctx), [['<a class="invalid">[]{http://host}.com</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[]{http://host/a}b]{http://host/ab}'), ctx), [['<a class="invalid">[]{http://host/a}b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{http%73://host}'), ctx), [['<a class="url" href="http%73://host">http%73://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{http://a%C3%A1}'), ctx), [['<a class="url" href="http://a%C3%A1" target="_blank">http://a%C3%A1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://á]{http://evil}'), ctx), [['<a class="invalid">http://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[xxx://á]{http://evil}'), ctx), [['<a class="invalid">xxx://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[mailto:á]{http://evil}'), ctx), [['<a class="invalid">mailto:á</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[file:///]{http://evil}'), ctx), [['<a class="invalid">file:///</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[.http://á]{http://evil}'), ctx), [['<a class="invalid">.http://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[0987654321]{tel:1234567890}'), ctx), [['<a class="invalid">0987654321</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[1234567890-]{tel:1234567890}'), ctx), [['<a class="invalid">1234567890-</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[-1234567890]{tel:1234567890}'), ctx), [['<a class="invalid">-1234567890</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[123456789a]{tel:1234567890}'), ctx), [['<a class="invalid">123456789a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[1234567890]{tel:ttel:1234567890}'), ctx), [['<a class="invalid">1234567890</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a]{b}'), ctx), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\#a]{b}'), ctx), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[c #a]{b}'), ctx), [['<a class="link" href="b">c #a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[c \\#a]{b}'), ctx), [['<a class="link" href="b">c #a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{#a}'), ctx), [['<a class="url" href="#a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}'), ctx), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\@a]{b}'), ctx), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[c @a]{b}'), ctx), [['<a class="link" href="b">c @a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[c \\@a]{b}'), ctx), [['<a class="link" href="b">c @a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{@a}'), ctx), [['<a class="url" href="@a">@a</a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{ }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{  }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{   }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{{}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{{b}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{b\nb}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{b\\\nb}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{ b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]{ b\n}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]{ }'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[ ]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[  ]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[\n]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[\\ ]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[\\\n]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[&Tab;]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a]{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a\nb]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[a\\\nb]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[<wbr>]{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[*a\nb*]{/}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://host}'), ctx), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{ttp://host}'), ctx), [['<a class="invalid">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{http://[::ffff:0:0%1]}'), ctx), [['<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{http://[::ffff:0:0/96]}'), ctx), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/.}'), ctx), [[`<a class="invalid">^/.</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/..}'), ctx), [[`<a class="invalid">^/..</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/../}'), ctx), [[`<a class="invalid">^/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/../..}'), ctx), [[`<a class="invalid">^/../..</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/../b}'), ctx), [[`<a class="invalid">^/../b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/../b/..}'), ctx), [[`<a class="invalid">^/../b/..</a>`], '']);
      assert.deepStrictEqual(inspect(parser(' []{b}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('![]{/}'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[]{b}'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{b }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{b  }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{ b }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{ b  }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{  b }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{  b  }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{  b   }'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{"}'), ctx), [[`<a class="url" href="&quot;">"</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{"}"}'), ctx), [[`<a class="url" href="&quot;">"</a>`], '"}']);
      assert.deepStrictEqual(inspect(parser('[]{\\}'), ctx), [[`<a class="url" href="\\">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{\\ }'), ctx), [[`<a class="url" href="\\">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{\\b}'), ctx), [[`<a class="url" href="\\b">\\b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{?b=c+d&\\#}'), ctx), [['<a class="url" href="?b=c+d&amp;\\#">?b=c+d&amp;\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{?&copy;}'), ctx), [['<a class="url" href="?&amp;copy;">?&amp;copy;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{#}'), ctx), [['<a class="url" href="#">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{#b}'), ctx), [['<a class="url" href="#b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{./b}'), ctx), [['<a class="url" href="./b">./b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}'), ctx), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b?/../}'), ctx), [[`<a class="url" href="/b?/../">^/b?/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b#/../}'), ctx), [[`<a class="url" href="/b#/../">^/b#/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/dir', location.origin) }), ctx), [[`<a class="url" href="/dir/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/dir/', location.origin) }), ctx), [[`<a class="url" href="/dir/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/folder/doc.md', location.origin) }), ctx), [[`<a class="url" href="/folder/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/folder/doc.md/', location.origin) }), ctx), [[`<a class="url" href="/folder/doc.md/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/.file', location.origin) }), ctx), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/0.0a', location.origin) }), ctx), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/0.a0', location.origin) }), ctx), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/0.0', location.origin) }), ctx), [[`<a class="url" href="/0.0/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[]{^/b}', { host: new URL('/0.0,0.0,0z', location.origin) }), ctx), [[`<a class="url" href="/0.0,0.0,0z/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[ a]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[ a ]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\ a]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[ \\ a]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a ]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a  ]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]{b}'), ctx), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]{#}'), ctx), [['<a class="link" href="#">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a]{#b}'), ctx), [['<a class="link" href="#b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a b]{c}'), ctx), [['<a class="link" href="c">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`[]{?#${encodeURIComponent(':/[]{}<>?#=& ')}}`), ctx), [['<a class="url" href="?#%3A%2F%5B%5D%7B%7D%3C%3E%3F%23%3D%26%20">?#%3A%2F[]{}&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{b}'), ctx), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{ ][ }'), ctx), [['<a class="url" href="][">][</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{ }{ }'), ctx), [['<a class="url" href="}{">}{</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{Http://host}'), ctx), [['<a class="url" href="Http://host" target="_blank">Http://host</a>'], '']);
    });

    it('tel', () => {
      assert.deepStrictEqual(inspect(parser('{tel:1234567890}'), ctx), [[`<a class="tel" href="tel:1234567890">tel:1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('{Tel:1234567890}'), ctx), [[`<a class="tel" href="Tel:1234567890">Tel:1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('{tel:+1234567890}'), ctx), [[`<a class="tel" href="tel:+1234567890">tel:+1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('{tel:+12-345-67-890}'), ctx), [[`<a class="tel" href="tel:+12-345-67-890">tel:+12-345-67-890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[1234567890]{tel:1234567890}'), ctx), [[`<a class="tel" href="tel:1234567890">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[1234567890]{tel:12-3456-7890}'), ctx), [[`<a class="tel" href="tel:12-3456-7890">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[12-3456-7890]{tel:1234567890}'), ctx), [[`<a class="tel" href="tel:1234567890">12-3456-7890</a>`], '']);
      assert.deepStrictEqual(inspect(parser('[+12-34567-890]{tel:+12-345-67890}'), ctx), [[`<a class="tel" href="tel:+12-345-67890">+12-34567-890</a>`], '']);
    });

    it('media', () => {
      assert.deepStrictEqual(inspect(parser('[![]{a}]{a}'), ctx), [['<a class="link" href="a" target="_blank"><img class="media" data-src="a" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[![]{a}]{b}'), ctx), [['<a class="link" href="b" target="_blank"><img class="media" data-src="a" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[![]{a} ]{b}'), ctx), [['<a class="link" href="b">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[![]{a}![]{a}]{b}'), ctx), [['<a class="link" href="b">![]{a}![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]{b}]{c}'), ctx), [['<a class="link" href="c">[![]{a}]{b}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[!http://host]{b}'), ctx), [['<a class="link" href="b" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[*]{/}'), ctx), [['<a class="link" href="/">*</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\[]{/}'), ctx), [['<a class="link" href="/">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\]]{/}'), ctx), [['<a class="link" href="/">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[]{a}]{a}'), ctx), [['<a class="link" href="a">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[]{a}]{b}'), ctx), [['<a class="link" href="b">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]{a}]{a}'), ctx), [['<a class="link" href="a">[![]{a}]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]{a}]{b}'), ctx), [['<a class="link" href="b">[![]{a}]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]{b}]{b}'), ctx), [['<a class="link" href="b">[![]{a}]{b}</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[((a))]{b}'), ctx), [['<a class="link" href="b"><span class="paren">((a))</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]{b}'), ctx), [['<a class="link" href="b">[[a]]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[!http://host]{/}'), ctx), [['<a class="link" href="/" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a]{b}'), ctx), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}'), ctx), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a@b]{c}'), ctx), [['<a class="link" href="c">@a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[a@b]{c}'), ctx), [['<a class="link" href="c">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[==a==]{b}'), ctx), [['<a class="link" href="b">==a==</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[*a*]{b}'), ctx), [['<a class="link" href="b"><em>a</em></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser('[]{//host}'), ctx), [['<a class="url" href="//host" target="_blank">//host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{//[::]}'), ctx), [['<a class="url" href="//[::]" target="_blank">//[::]</a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser('[]{/ name=}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ name="}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ name="""}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ name}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ name=""}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ name=" "}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ name="\\""}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ __proto__}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ constructor}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ rel="prefetch"}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ aspect-ratio="4/3"}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ 4:3}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ =}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/  name}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/\nname}'), ctx), undefined);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow=}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow=nofollow}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow=""}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow="nofollow"}'), ctx), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow nofollow}'), ctx), [['<a class="invalid" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow}'), ctx), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{/ nofollow }'), ctx), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{ / nofollow}'), ctx), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{ / nofollow }'), ctx), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{http://host nofollow}'), ctx), [['<a class="url" href="http://host" target="_blank" rel="nofollow">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[!http://host]{http://host nofollow}'), ctx), [['<a class="link" href="http://host" target="_blank" rel="nofollow"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
    });

  });

});
