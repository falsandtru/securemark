import { LinkParser } from '../inline';
import { textlink, medialink } from './link';
import { union, some } from '../../combinator';
import { Input, input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/link', () => {
  describe('link', () => {
    const link: LinkParser = union([
      medialink,
      textlink,
    ]);
    const parser = some(link);

    it('xss', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{javascript:alert}')), [['<a class="invalid">javascript:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{vbscript:alert}')), [['<a class="invalid">vbscript:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K}')), [['<a class="invalid">data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{any:alert}')), [['<a class="invalid">any:alert</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{"}')), [['<a class="url" href="&quot;">"</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{<}')), [['<a class="url" href="&lt;">&lt;</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\}')), [['<a class="url" href="\\">\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\"}')), [['<a class="url" href="\\&quot;">\\"</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\<}')), [['<a class="url" href="\\&lt;">\\&lt;</a>'], '']);
    });

    it('fishing', () => {
      assert.deepStrictEqual(inspect(parser, input('[http://host]{http://evil}')), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\http://host]{http://evil}')), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[https://host]{http://host}')), [['<a class="invalid">https://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{http://host}.com]{http://host}')), [['<a class="invalid">[]{http://host}.com</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{http://host/a}b]{http://host/ab}')), [['<a class="invalid">[]{http://host/a}b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{http%73://host}')), [['<a class="url" href="http%73://host">http%73://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{http://a%C3%A1}')), [['<a class="url" href="http://a%C3%A1" target="_blank">http://a%C3%A1</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[http://á]{http://evil}')), [['<a class="invalid">http://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[xxx://á]{http://evil}')), [['<a class="invalid">xxx://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[mailto:á]{http://evil}')), [['<a class="invalid">mailto:á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[file:///]{http://evil}')), [['<a class="invalid">file:///</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[.http://á]{http://evil}')), [['<a class="invalid">.http://á</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[0987654321]{tel:1234567890}')), [['<a class="invalid">0987654321</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890-]{tel:1234567890}')), [['<a class="invalid">1234567890-</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[-1234567890]{tel:1234567890}')), [['<a class="invalid">-1234567890</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[123456789a]{tel:1234567890}')), [['<a class="invalid">123456789a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890]{tel:ttel:1234567890}')), [['<a class="invalid">1234567890</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a]{b}')), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\#a]{b}')), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c #a]{b}')), [['<a class="link" href="b">c #a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c \\#a]{b}')), [['<a class="link" href="b">c #a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{#a}')), [['<a class="url" href="#a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[@a]{b}')), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\@a]{b}')), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c @a]{b}')), [['<a class="link" href="b">c @a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[c \\@a]{b}')), [['<a class="link" href="b">c @a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{@a}')), [['<a class="url" href="@a">@a</a>'], '']);
    });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{ }')), [['<span class="invalid">[]{ }</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{  }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{   }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{{}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{{b}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{b\nc}')), [['<span class="invalid">[]{b</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('[]{b\\\nc}')), [['<span class="invalid">[]{b\\</span>'], '\nc}']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b}')), [['<span class="invalid">[]{ b}</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b\n}')), [['<span class="invalid">[]{ b</span>'], '\n}']);
      assert.deepStrictEqual(inspect(parser, input('[ ]{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ ]{ }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[  ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ a]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ a ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\\ a]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[ \\ a]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\n]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\\ ]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[\\\n]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[&Tab;]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a]{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a\nb]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[a\\\nb]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[<wbr>]{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[*a\nb*]{/}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[http://host]{http://host}')), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ttp://host}')), [['<a class="invalid">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{http://[::ffff:0:0%1]}')), [['<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{http://[::ffff:0:0/96]}')), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/.}')), [[`<a class="invalid">^/.</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/..}')), [[`<a class="invalid">^/..</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../}')), [[`<a class="invalid">^/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../..}')), [[`<a class="invalid">^/../..</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../b}')), [[`<a class="invalid">^/../b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/../b/..}')), [[`<a class="invalid">^/../b/..</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(' []{b}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('![]{/}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{b}')), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{b }')), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{b  }')), [['<span class="invalid">[]{b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b }')), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ b  }')), [['<span class="invalid">[]{ b</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{  b }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{  b  }')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]{"}')), [[`<a class="url" href="&quot;">"</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{"}"}')), [[`<a class="url" href="&quot;">"</a>`], '"}']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\}')), [[`<a class="url" href="\\">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\ }')), [[`<a class="url" href="\\">\\</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{\\b}')), [[`<a class="url" href="\\b">\\b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{?b=c+d&\\#}')), [['<a class="url" href="?b=c+d&amp;\\#">?b=c+d&amp;\\#</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{?&copy;}')), [['<a class="url" href="?&amp;copy;">?&amp;copy;</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{#}')), [['<a class="url" href="#">#</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{#b}')), [['<a class="url" href="#b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{./b}')), [['<a class="url" href="./b">./b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}')), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b?/../}')), [[`<a class="url" href="/b?/../">^/b?/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b#/../}')), [[`<a class="url" href="/b#/../">^/b#/../</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/dir', location.origin) }))), [[`<a class="url" href="/dir/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/dir/', location.origin) }))), [[`<a class="url" href="/dir/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/folder/doc.md', location.origin) }))), [[`<a class="url" href="/folder/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/folder/doc.md/', location.origin) }))), [[`<a class="url" href="/folder/doc.md/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/.file', location.origin) }))), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/0.0a', location.origin) }))), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/0.a0', location.origin) }))), [[`<a class="url" href="/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/0.0', location.origin) }))), [[`<a class="url" href="/0.0/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{^/b}', new Input({ host: new URL('/0.0,0.0,0z', location.origin) }))), [[`<a class="url" href="/0.0,0.0,0z/b">^/b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[a ]{b}')), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a  ]{b}')), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]{b}')), [['<a class="link" href="b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]{#}')), [['<a class="link" href="#">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a]{#b}')), [['<a class="link" href="#b">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a b]{c}')), [['<a class="link" href="c">a b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`[]{?#${encodeURIComponent(':/[]{}<>?#=& ')}}`)), [['<a class="url" href="?#%3A%2F%5B%5D%7B%7D%3C%3E%3F%23%3D%26%20">?#%3A%2F[]{}&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{b}')), [['<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{ ][ }')), [['<a class="url" href="][">][</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{ }{ }')), [['<a class="url" href="}{">}{</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('{Http://host}')), [['<a class="url" href="Http://host" target="_blank">Http://host</a>'], '']);
    });

    it('tel', () => {
      assert.deepStrictEqual(inspect(parser, input('{tel:1234567890}')), [[`<a class="tel" href="tel:1234567890">tel:1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('{Tel:1234567890}')), [[`<a class="tel" href="Tel:1234567890">Tel:1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('{tel:+1234567890}')), [[`<a class="tel" href="tel:+1234567890">tel:+1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('{tel:+12-345-67-890}')), [[`<a class="tel" href="tel:+12-345-67-890">tel:+12-345-67-890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890]{tel:1234567890}')), [[`<a class="tel" href="tel:1234567890">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[1234567890]{tel:12-3456-7890}')), [[`<a class="tel" href="tel:12-3456-7890">1234567890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[12-3456-7890]{tel:1234567890}')), [[`<a class="tel" href="tel:1234567890">12-3456-7890</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[+12-34567-890]{tel:+12-345-67890}')), [[`<a class="tel" href="tel:+12-345-67890">+12-34567-890</a>`], '']);
    });

    it('media', () => {
      assert.deepStrictEqual(inspect(parser, input('[![]{a}]{a}')), [['<a class="link" href="a" target="_blank"><img class="media" data-src="a" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[![]{a}]{b}')), [['<a class="link" href="b" target="_blank"><img class="media" data-src="a" alt="a"></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[![]{a} ]{b}')), [['<a class="link" href="b">![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[![]{a}![]{a}]{b}')), [['<a class="link" href="b">![]{a}![]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{b}]{c}')), [['<a class="link" href="c">[![]{a}]{b}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[!http://host]{b}')), [['<a class="link" href="b" target="_blank"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('[*]{/}')), [['<a class="link" href="/">*</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\[]{/}')), [['<a class="link" href="/">[</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[\\]]{/}')), [['<a class="link" href="/">]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{a}]{a}')), [['<a class="link" href="a">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[]{a}]{b}')), [['<a class="link" href="b">[]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{a}]{a}')), [['<a class="link" href="a">[![]{a}]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{a}]{b}')), [['<a class="link" href="b">[![]{a}]{a}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]{b}]{b}')), [['<a class="link" href="b">[![]{a}]{b}</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[((a))]{b}')), [['<a class="link" href="b"><span class="paren">(<span class="paren">(a)</span>)</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[[a]]]{b}')), [['<a class="link" href="b">[[a]]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[#a]{b}')), [['<a class="link" href="b">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[@a]{b}')), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[@a@b]{c}')), [['<a class="link" href="c">@a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[a@b]{c}')), [['<a class="link" href="c">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[==a==]{b}')), [['<a class="link" href="b"><mark>a</mark></a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[*a*]{b}')), [['<a class="link" href="b"><em>a</em></a>'], '']);
    });

    it('external', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{//host}')), [['<a class="url" href="//host" target="_blank">//host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{//[::]}')), [['<a class="url" href="//[::]" target="_blank">//[::]</a>'], '']);
    });

    it('attribute', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{/ name=}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name="}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name="""}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name=""}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name=" "}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ name="\\""}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ __proto__}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ constructor}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ rel="prefetch"}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ aspect-ratio="4/3"}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ 4:3}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ =}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/\nname}')), [['<span class="invalid">[]{/</span>'], '\nname}']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow=}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow=nofollow}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow=""}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow="nofollow"}')), [['<a class="invalid" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow nofollow}')), [['<a class="invalid" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow}')), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow }')), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{/ nofollow  }')), [['<span class="invalid">[]{/ nofollow</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{/  nofollow}')), [['<span class="invalid">[]{/</span>'], '  nofollow}']);
      assert.deepStrictEqual(inspect(parser, input('[]{ / nofollow}')), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ / nofollow }')), [['<a class="url" href="/" rel="nofollow">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[]{ / nofollow  }')), [['<span class="invalid">[]{ / nofollow</span>'], '  }']);
      assert.deepStrictEqual(inspect(parser, input('[]{ /  nofollow}')), [['<span class="invalid">[]{ /</span>'], '  nofollow}']);
      assert.deepStrictEqual(inspect(parser, input('[]{http://host nofollow}')), [['<a class="url" href="http://host" target="_blank" rel="nofollow">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[!http://host]{http://host nofollow}')), [['<a class="link" href="http://host" target="_blank" rel="nofollow"><img class="media" data-src="http://host" alt="http://host"></a>'], '']);
    });

  });

});
