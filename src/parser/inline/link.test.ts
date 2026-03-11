import { LinkParser } from '../inline';
import { textlink, medialink } from './link';
import { some, union } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/link', () => {
  describe('link', () => {
    const link: LinkParser = union([
      medialink,
      textlink,
    ]);
    const parser = some(link);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{javascript:alert}', new Context())), [['<a class="invalid">javascript:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{vbscript:alert}', new Context())), [['<a class="invalid">vbscript:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}', new Context())), [['<a class="invalid">data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{any:alert}', new Context())), [['<a class="invalid">any:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{"}', new Context())), [['<a class="url" href="&quot;">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{<}', new Context())), [['<a class="url" href="&lt;">&lt;</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\}', new Context())), [['<a class="url" href="\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\"}', new Context())), [['<a class="url" href="\\&quot;">\\"</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\<}', new Context())), [['<a class="url" href="\\&lt;">\\&lt;</a>'], '']);
    });

    it('fishing', () => {
      assert.deepStrictEqual(inspect(parser, input('[http://host]{http://evil}', new Context())), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\http://host]{http://evil}', new Context())), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[https://host]{http://host}', new Context())), [['<a class="invalid">https://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{http://host}.com]{http://host}', new Context())), [['<a class="invalid">[]{http://host}.com</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{http://host/a}b]{http://host/ab}', new Context())), [['<a class="invalid">[]{http://host/a}b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{http%73://host}', new Context())), [['<a class="url" href="http%73://host">http%73://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{http://a%C3%A1}', new Context())), [['<a class="url" href="http://a%C3%A1" target="_blank">http://a%C3%A1</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[http://á]{http://evil}', new Context())), [['<a class="invalid">http://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[xxx://á]{http://evil}', new Context())), [['<a class="invalid">xxx://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[mailto:á]{http://evil}', new Context())), [['<a class="invalid">mailto:á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[file:///]{http://evil}', new Context())), [['<a class="invalid">file:///</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[.http://á]{http://evil}', new Context())), [['<a class="invalid">.http://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[0987654321]{tel:1234567890}', new Context())), [['<a class="invalid">0987654321</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890-]{tel:1234567890}', new Context())), [['<a class="invalid">1234567890-</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[-1234567890]{tel:1234567890}', new Context())), [['<a class="invalid">-1234567890</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[123456789a]{tel:1234567890}', new Context())), [['<a class="invalid">123456789a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890]{tel:ttel:1234567890}', new Context())), [['<a class="invalid">1234567890</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a]{b}', new Context())), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\#a]{b}', new Context())), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c #a]{b}', new Context())), [['<a class="link" href="b">c #a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c \\#a]{b}', new Context())), [['<a class="link" href="b">c #a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{#a}', new Context())), [['<a class="url" href="#a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[@a]{b}', new Context())), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\@a]{b}', new Context())), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c @a]{b}', new Context())), [['<a class="link" href="b">c @a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c \\@a]{b}', new Context())), [['<a class="link" href="b">c @a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{@a}', new Context())), [['<a class="url" href="@a">@a</a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{ }', new Context())), [['<span class="invalid">[]{ }</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{  }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{   }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{{}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{{b}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{b\nc}', new Context())), [['<span class="invalid">[]{b</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('[]{b\\\nc}', new Context())), [['<span class="invalid">[]{b\\</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b}', new Context())), [['<span class="invalid">[]{ b}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b\n}', new Context())), [['<span class="invalid">[]{ b</span>'], '\n}']);
      assert.deepStrictEqual(inspect(parser, input('[ ]{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ ]{ }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[  ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ a]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ a ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\\ a]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ \\ a]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\n]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\\ ]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\\\n]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&Tab;]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&zwj;]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a\nb]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a\\\nb]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[<wbr>]{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[*a\nb*]{/}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[http://host]{http://host}', new Context())), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ttp://host}', new Context())), [['<a class="invalid">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{http://[::ffff:0:0%1]}', new Context())), [['<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{http://[::ffff:0:0/96]}', new Context())), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/.}', new Context())), [[`<a class="invalid">^/.</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/..}', new Context())), [[`<a class="invalid">^/..</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../}', new Context())), [[`<a class="invalid">^/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../..}', new Context())), [[`<a class="invalid">^/../..</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../b}', new Context())), [[`<a class="invalid">^/../b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../b/..}', new Context())), [[`<a class="invalid">^/../b/..</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(' []{b}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{/}', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{b}', new Context())), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{b }', new Context())), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{b  }', new Context())), [['<span class="invalid">[]{b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b }', new Context())), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b  }', new Context())), [['<span class="invalid">[]{ b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{  b }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{  b  }', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{"}', new Context())), [[`<a class="url" href="&quot;">"</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{"}"}', new Context())), [[`<a class="url" href="&quot;">"</a>`], '"}']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\}', new Context())), [[`<a class="url" href="\\">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\ }', new Context())), [[`<a class="url" href="\\">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\b}', new Context())), [[`<a class="url" href="\\b">\\b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{?b=c+d&\\#}', new Context())), [['<a class="url" href="?b=c+d&amp;\\#">?b=c+d&amp;\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{?&copy;}', new Context())), [['<a class="url" href="?&amp;copy;">?&amp;copy;</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{#}', new Context())), [['<a class="url" href="#">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{#b}', new Context())), [['<a class="url" href="#b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{./b}', new Context())), [['<a class="url" href="./b">./b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context())), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b?/../}', new Context())), [[`<a class="url" href="/b?/../">^/b?/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b#/../}', new Context())), [[`<a class="url" href="/b#/../">^/b#/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/dir', location.origin) }))), [[`<a class="url" href="/dir/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/dir/', location.origin) }))), [[`<a class="url" href="/dir/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/folder/doc.md', location.origin) }))), [[`<a class="url" href="/folder/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/folder/doc.md/', location.origin) }))), [[`<a class="url" href="/folder/doc.md/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/.file', location.origin) }))), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/0.0a', location.origin) }))), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/0.a0', location.origin) }))), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/0.0', location.origin) }))), [[`<a class="url" href="/0.0/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Context({ host: new URL('/0.0,0.0,0z', location.origin) }))), [[`<a class="url" href="/0.0,0.0,0z/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[a ]{b}', new Context())), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a  ]{b}', new Context())), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]{b}', new Context())), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]{#}', new Context())), [['<a class="link" href="#">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]{#b}', new Context())), [['<a class="link" href="#b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a b]{c}', new Context())), [['<a class="link" href="c">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`[]{?#${encodeURIComponent(':/[]{}<>?#=& ')}}`, new Context())), [['<a class="url" href="?#%3A%2F%5B%5D%7B%7D%3C%3E%3F%23%3D%26%20">?#%3A%2F[]{}&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{b}', new Context())), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{ ][ }', new Context())), [['<a class="url" href="][">][</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{ }{ }', new Context())), [['<a class="url" href="}{">}{</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{Http://host}', new Context())), [['<a class="url" href="Http://host" target="_blank">Http://host</a>'], '']);
    });

    it('tel', () => {
      assert.deepStrictEqual(inspect(parser, input('{tel:1234567890}', new Context())), [[`<a class="tel" href="tel:1234567890">tel:1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('{Tel:1234567890}', new Context())), [[`<a class="tel" href="Tel:1234567890">Tel:1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('{tel:+1234567890}', new Context())), [[`<a class="tel" href="tel:+1234567890">tel:+1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('{tel:+12-345-67-890}', new Context())), [[`<a class="tel" href="tel:+12-345-67-890">tel:+12-345-67-890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890]{tel:1234567890}', new Context())), [[`<a class="tel" href="tel:1234567890">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890]{tel:12-3456-7890}', new Context())), [[`<a class="tel" href="tel:12-3456-7890">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[12-3456-7890]{tel:1234567890}', new Context())), [[`<a class="tel" href="tel:1234567890">12-3456-7890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[+12-34567-890]{tel:+12-345-67890}', new Context())), [[`<a class="tel" href="tel:+12-345-67890">+12-34567-890</a>`], '']);
    });

    it('media', () => {
      assert.deepStrictEqual(inspect(parser, input('[![]{a}]{a}', new Context())), [['<a class="link" href="a" target="_blank"><img class="media" data-src="a" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[![]{a}]{b}', new Context())), [['<a class="link" href="b" target="_blank"><img class="media" data-src="a" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[![]{a} ]{b}', new Context())), [['<a class="link" href="b">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[![]{a}![]{a}]{b}', new Context())), [['<a class="link" href="b">![]{a}![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{b}]{c}', new Context())), [['<a class="link" href="c">[![]{a}]{b}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[!http://host]{b}', new Context())), [['<a class="link" href="b" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('[*]{/}', new Context())), [['<a class="link" href="/">*</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\[]{/}', new Context())), [['<a class="link" href="/">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\]]{/}', new Context())), [['<a class="link" href="/">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{a}]{a}', new Context())), [['<a class="link" href="a">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{a}]{b}', new Context())), [['<a class="link" href="b">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{a}]{a}', new Context())), [['<a class="link" href="a">[![]{a}]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{a}]{b}', new Context())), [['<a class="link" href="b">[![]{a}]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{b}]{b}', new Context())), [['<a class="link" href="b">[![]{a}]{b}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[((a))]{b}', new Context())), [['<a class="link" href="b"><span class="paren">((a))</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[[a]]]{b}', new Context())), [['<a class="link" href="b">[[a]]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a]{b}', new Context())), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[@a]{b}', new Context())), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[@a@b]{c}', new Context())), [['<a class="link" href="c">@a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a@b]{c}', new Context())), [['<a class="link" href="c">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[==a==]{b}', new Context())), [['<a class="link" href="b"><mark>a</mark></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[*a*]{b}', new Context())), [['<a class="link" href="b"><em>a</em></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{//host}', new Context())), [['<a class="url" href="//host" target="_blank">//host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{//[::]}', new Context())), [['<a class="url" href="//[::]" target="_blank">//[::]</a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{/ name=}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name="}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name="""}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name=""}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name=" "}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name="\\""}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ __proto__}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ constructor}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ rel="prefetch"}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ aspect-ratio="4/3"}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ 4:3}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ =}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/\nname}', new Context())), [['<span class="invalid">[]{/</span>'], '\nname}']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow=}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow=nofollow}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow=""}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow="nofollow"}', new Context())), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow nofollow}', new Context())), [['<a class="invalid" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow}', new Context())), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow }', new Context())), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow  }', new Context())), [['<span class="invalid">[]{/ nofollow</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{/  nofollow}', new Context())), [['<span class="invalid">[]{/</span>'], '  nofollow}']);
      assert.deepStrictEqual(inspect(parser, input('[]{ / nofollow}', new Context())), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ / nofollow }', new Context())), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ / nofollow  }', new Context())), [['<span class="invalid">[]{ / nofollow</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{ /  nofollow}', new Context())), [['<span class="invalid">[]{ /</span>'], '  nofollow}']);
      assert.deepStrictEqual(inspect(parser, input('[]{http://host nofollow}', new Context())), [['<a class="url" href="http://host" target="_blank" rel="nofollow">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[!http://host]{http://host nofollow}', new Context())), [['<a class="link" href="http://host" target="_blank" rel="nofollow"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
    });

  });

});
