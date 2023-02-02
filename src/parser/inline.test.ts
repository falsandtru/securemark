import { inline } from './inline';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    const parser = (source: string) => some(inline)({ source, context: {} });

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('\\0')), [['0'], '']);
      assert.deepStrictEqual(inspect(parser('\\1')), [['1'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('\\A')), [['A'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('+++a+++')), [['+++', 'a', '+++'], '']);
      assert.deepStrictEqual(inspect(parser('~~~a~~~')), [['~~~', 'a', '~~~'], '']);
      assert.deepStrictEqual(inspect(parser('===a===')), [['===', 'a', '==='], '']);
      assert.deepStrictEqual(inspect(parser('__a__')), [['__', 'a', '__'], '']);
      assert.deepStrictEqual(inspect(parser('___a___')), [['___', 'a', '___'], '']);
      assert.deepStrictEqual(inspect(parser('a_b_c')), [['a', '<em>b</em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a**')), [['**', 'a', '**'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['***', 'a', '***'], '']);
      assert.deepStrictEqual(inspect(parser('*[*]')), [['*', '[', '*', ']'], '']);
      assert.deepStrictEqual(inspect(parser('*<*>')), [['<strong>&lt;</strong>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('*a((b))*')), [['<strong>a<sup class="annotation"><span>b</span></sup></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('``a`')), [['``', 'a', '`'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]')), [['[', '<a class="account" href="/@a">@a</a>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[#1][#2]')), [['<a class="index" href="#index:1">1</a>', '<a class="index" href="#index:2">2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[$1]')), [['[', '$', '1', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$1-2]')), [['[', '$', '1-2', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$-1][$-2]')), [['<a class="label" data-label="$-1">$-1</a>', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-1, $-2')), [['<a class="label" data-label="$-1">$-1</a>', ',', ' ', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-1 and $-2')), [['<a class="label" data-label="$-1">$-1</a>', ' ', 'and', ' ', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$$-1')), [['$', '<a class="label" data-label="$-1">$-1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#a]]')), [['<sup class="reference"><span><a class="hashtag" href="/hashtags/a">#a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[$-1]]')), [['<sup class="reference"><span><a class="label" data-label="$-1">$-1</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]]{b}')), [['<sup class="reference"><span>#-1</span></sup>', '<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]](b)')), [['<sup class="reference"><span>#-1</span></sup>', '(', 'b', ')'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]a]{b}')), [['<a class="link" href="b">[#-1]a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]a](b)')), [['[', '<a class="index" href="#index:-1">-1</a>', 'a', ']', '(', 'b', ')'], '']);
      assert.deepStrictEqual(inspect(parser('[#a]{b}')), [['<a class="index" href="#index:a">a</a>', '<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}')), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://evil}')), [['[', '<a class="url" href="http://host" target="_blank">http://host</a>', ']', '<a class="url" href="http://evil" target="_blank">http://evil</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://host}')), [['[', '<a class="url" href="http://host" target="_blank">http://host</a>', ']', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{{a}}')), [['[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{{a}}')), [['!', '[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[\n]{a}')), [['[', '<br>', ']', '<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\\n]{a}')), [['[', '<br>', ']', '<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{}')), [['!', '{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('!{a}')), [['<a href="a" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{a}}')), [['!', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{{a}}}')), [['!', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!!{a}')), [['!', '<a href="a" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}')), [['$', '<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('${{a}}')), [['$', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${{{a}}}')), [['$', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('Di$ney Micro$oft')), [['Di', '$', 'ney', ' ', 'Micro', '$', 'oft'], '']);
      assert.deepStrictEqual(inspect(parser('Di$ney, Micro$oft')), [['Di', '$', 'ney', ',', ' ', 'Micro', '$', 'oft'], '']);
      assert.deepStrictEqual(inspect(parser('(((a))')), [['', '(', '<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))')), [['', '(', '', '(', '<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation"><span><span class="paren">((a))</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<bdi>))')), [['<sup class="annotation"><span><span class="invalid">&lt;bdi&gt;</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((${))}$')), [['', '(', '', '(', '<span class="math" translate="no" data-src="${))}$">${))}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('"((""))')), [['"', '<sup class="annotation"><span>""</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]')), [['', '[', '<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]')), [['', '[', '', '[', '<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference"><span>[[a]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[$-1]]]')), [['<sup class="reference"><span><a class="label" data-label="$-1">$-1</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[]{a}]]')), [['<sup class="reference"><span><a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]{b}]]')), [['<sup class="reference"><span><a class="link" href="b">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[(([a]{#}))]{#}')), [['<a class="link" href="#"><span class="paren">(<span class="paren">([a]{#})</span>)</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<bdi>]]')), [['<sup class="reference"><span><span class="invalid">&lt;bdi&gt;</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[${]]}$')), [['', '[', '', '[', '<span class="math" translate="no" data-src="${]]}$">${]]}$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('"[[""]]')), [['"', '<sup class="reference"><span>""</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[==a==]{b}')), [['<a class="link" href="b">==a==</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a](b)]{c}')), [['<a class="link" href="c"><ruby>a<rp>(</rp><rt>b</rt><rp>)</rp></ruby></a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[[[[{a}')), [['', '[', '', '[', '', '[', '', '[', '', '[', '', '[', '', '[', '<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('<http://host>')), [['<', '<a class="url" href="http://host" target="_blank">http://host</a>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('[~http://host')), [['', '[', '~', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a@b')), [['', '[', '~', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~~a~~]')), [['[', '<del>a</del>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^http://host')), [['[^', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a@b')), [['[^', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a++b\nc++]')), [['[', '<a class="hashtag" href="/hashtags/a">#a</a>', '<ins>b<br>c</ins>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[++a\nb++]{/}')), [['[', '<ins>a<br>b</ins>', ']', '<a class="url" href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[++a\nb]++')), [['[', '++', 'a', '<br>', 'b', ']', '++'], '']);
      assert.deepStrictEqual(inspect(parser('[++[a\nb++]')), [['', '[', '++', '[', 'a', '<br>', 'b', '++', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[[++a\nb++]]')), [['[', '[', '<ins>a<br>b</ins>', ']', ']'], '']);
      assert.deepStrictEqual(inspect(parser('"[% *"*"*')), [['"', '[%', ' ', '*', '"', '*', '"', '*'], '']);
      assert.deepStrictEqual(inspect(parser('"[% "*"* %]')), [['"', '[%', ' ', '"', '*', '"', '*', ' ', '%', ']'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser('\nhttp://host')), [['<br>', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp://host')), [['0aAhttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('?http://host')), [['?', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!http://host')), [['0', '<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?http://host')), [['0', '?', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!!http://host')), [['0', '!', '<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?!http://host')), [['0', '?', '<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!?http://host')), [['0', '!', '?', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host_')), [['<em><a class="url" href="http://host" target="_blank">http://host</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<strong><a class="url" href="http://host" target="_blank">http://host</a></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host)')), [['<span class="paren">(<a class="url" href="http://host" target="_blank">http://host</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('あhttp://hostい')), [['あ', '<a class="url" href="http://host" target="_blank">http://host</a>', 'い'], '']);
    });

    it('email', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b')), [['_', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b_')), [['<em><a class="email" href="mailto:a@b">a@b</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a@b*')), [['<strong><a class="email" href="mailto:a@b">a@b</a></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('(a@b)')), [['<span class="paren">(<a class="email" href="mailto:a@b">a@b</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), [[' ', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('++a++b@c++')), [['<ins>a</ins>', '<a class="email" href="mailto:b@c">b@c</a>', '++'], '']);
    });

    it('channel', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#domain/b')), [['@a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#b')), [['<a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#domain/b')), [['@domain/a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('_@a#b')), [['_', '<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), [[' ', '<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a_')), [['<em><a class="account" href="/@a">@a</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<strong><a class="account" href="/@a">@a</a></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['<span class="paren">(<a class="account" href="/@a">@a</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<a class="account" href="/@a">@a</a>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#a#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#a#b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a class="hashtag" href="/hashtags/a">#a</a>', '<br>', 'b', '<br>', '<a class="hashtag" href="/hashtags/c">#c</a>', '<br>', '<a class="index" href="#index:d">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##a'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('0a#b')), [['0a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('あい#b')), [['あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあ#b')), [['0aあ#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあい#b')), [['0a', 'あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('「#あ」')), [['「', '<a class="hashtag" href="/hashtags/あ">#あ</a>', '」'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a_#b')), [['<em>a</em>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a*#b')), [['<strong>a</strong>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation"><span>a</span></sup>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="reference"><span>a</span></sup>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['', '[', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
    });

    it('hashnum', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashnum">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#12345678901234567@a')), [['#12345678901234567@a'], '']);
      assert.deepStrictEqual(inspect(parser('「#1」')), [['「', '<a class="hashnum">#1</a>', '」'], '']);
    });

  });

});
