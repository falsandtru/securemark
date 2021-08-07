import { inline } from './inline';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    const parser = (source: string) => some(inline)(source, {});

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
      assert.deepStrictEqual(inspect(parser('* a*')), [['*', ' ', 'a', '*'], '']);
      assert.deepStrictEqual(inspect(parser('** a**')), [['**', ' ', 'a', '**'], '']);
      assert.deepStrictEqual(inspect(parser('*** a***')), [['***', ' ', 'a', '***'], '']);
      assert.deepStrictEqual(inspect(parser('**** a****')), [['****', ' ', 'a', '****'], '']);
      assert.deepStrictEqual(inspect(parser('*a**')), [['<em>a</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*')), [['*', 'a', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*c')), [['*', 'a', '**', 'b', '*', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*c*')), [['*', 'a', '**', 'b', '<em>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**')), [['*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*a  **b***')), [['<em>a  <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a  **b***c')), [['<em>a  <strong>b</strong></em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['**', 'a', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b**')), [['**', 'a', '<em>b</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b**c')), [['**', 'a', '*', 'b', '**', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a  *b***')), [['<strong>a  <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a  *b***c')), [['<strong>a  <em>b</em></strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**')), [['<strong><em>a</em>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b  **')), [['**', '<em>a</em>', 'b', '  ', '**'], '']);
      assert.deepStrictEqual(inspect(parser('***a* b**')), [['<strong><em>a</em> b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*')), [['<em><strong>a</strong>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b  *')), [['*', '<strong>a</strong>', 'b', '  ', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a** b*')), [['<em><strong>a</strong> b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*')), [['**', '<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**')), [['*', '<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***b')), [['<em><strong>a</strong></em>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('***a****')), [['<em><strong>a</strong></em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('****a***')), [['****', 'a', '***'], '']);
      assert.deepStrictEqual(inspect(parser('****a****')), [['****', 'a', '****'], '']);
      assert.deepStrictEqual(inspect(parser('*(*a*)*')), [['<em><span class="paren">(<em>a</em>)</span></em>'], '']);
      assert.deepStrictEqual(inspect(parser('**(**a**)**')), [['<strong><span class="paren">(<strong>a</strong>)</span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*++ ++*')), [['<em><ins> </ins></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*++ a ++*')), [['<em><ins> a </ins></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*++  a  ++*')), [['<em><ins>  a  </ins></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<small>`a`</small>*')), [['<em><small><code data-src="`a`">a</code></small></em>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>*<bdi>a</bdi>*</small>')), [['<small><em><bdi>a</bdi></em></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>((<bdi>((a))</bdi>))</bdi>')), [['<bdi><sup class="annotation"><bdi><span class="paren">((a))</span></bdi></sup></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>[[<bdi>[[a]]</bdi>]]</bdi>')), [['<bdi><sup class="reference"><bdi>[[a]]</bdi></sup></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('*[*]')), [['*', '[', '*', ']'], '']);
      assert.deepStrictEqual(inspect(parser('*<*>')), [['<em>&lt;</em>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('*a((b))*')), [['<em>a<sup class="annotation">b</sup></em>'], '']);
      assert.deepStrictEqual(inspect(parser('``a`')), [['``', 'a', '`'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]')), [['[', '<a href="/@a" class="account">@a</a>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[#1][#2]')), [['<a class="index" href="#index:1">1</a>', '<a class="index" href="#index:2">2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[$1]')), [['[', '$', '1', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$1-2]')), [['[', '$', '1', '-', '2', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$-1][$-2]')), [['<a class="label" data-label="$-1">$-1</a>', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-1$-2')), [['<a class="label" data-label="$-1">$-1</a>', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$$-1')), [['$', '<a class="label" data-label="$-1">$-1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#a]]')), [['<sup class="reference"><a href="/hashtags/a" class="hashtag">#a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[$-1]]')), [['<sup class="reference"><a class="label" data-label="$-1">$-1</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]]{b}')), [['<sup class="reference">#-1</sup>', '<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]](b)')), [['<sup class="reference">#-1</sup>', '(b)'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]a]{b}')), [['<a href="b">[#-1]a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]a](b)')), [['[', '<a class="index" href="#index:-1">-1</a>', 'a', ']', '(b)'], '']);
      assert.deepStrictEqual(inspect(parser('[#a]{b}')), [['<a class="index" href="#index:a">a</a>', '<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}')), [['[', '<a href="/@a" class="account">@a</a>', ']', '<a href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://evil}')), [['[', '<a href="http://host" target="_blank">http://host</a>', ']', '<a href="http://evil" target="_blank">http://evil</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://host}')), [['[', '<a href="http://host" target="_blank">http://host</a>', ']', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{{a}}')), [['[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{{a}}')), [['!', '[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[\n]{a}')), [['[', '<br>', ']', '<a href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\\n]{a}')), [['[', '<span class="linebreak"> </span>', ']', '<a href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['<a href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{}')), [['!', '{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('!{a}')), [['<a href="a" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{a}}')), [['!', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{{a}}}')), [['!', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!!{a}')), [['!', '<a href="a" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}')), [['$', '<a href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('${{a}}')), [['$', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${{{a}}}')), [['$', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('Di$ney Micro$oft')), [['Di', '$', 'ney', ' ', 'Micro', '$', 'oft'], '']);
      assert.deepStrictEqual(inspect(parser('Di$ney, Micro$oft')), [['Di', '$', 'ney', ',', ' ', 'Micro', '$', 'oft'], '']);
      assert.deepStrictEqual(inspect(parser('(((a))')), [['(', '<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))')), [['(', '(', '<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation"><span class="paren">((a))</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]')), [['[', '<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]')), [['[', '[', '<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference">[[a]]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[$-1]]]')), [['<sup class="reference"><a class="label" data-label="$-1">$-1</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[]{a}]]')), [['<sup class="reference"><a href="a">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]{b}]]')), [['<sup class="reference"><a href="b">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[(([a]{#}))]{#}')), [['<a href="#"><span class="paren">(<span class="paren">([a]{#})</span>)</span></a>'], '']);
      assert.deepStrictEqual(inspect(parser('<http://host>')), [['<', '<a href="http://host" target="_blank">http://host</a>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('<<small>a<</small>')), [['<', '<small>a&lt;</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<sup><sub>a</sub>')), [['<', 'sup', '>', '<sub>a</sub>'], '']);
      assert.deepStrictEqual(inspect(parser('[~http://host')), [['[', '~', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a@b')), [['[', '~', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~~a~~]')), [['[', '<del>a</del>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^http://host')), [['[', '^', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a@b')), [['[', '^', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a*b\nc*]')), [['[', '<a href="/hashtags/a" class="hashtag">#a</a>', '<em>b<br>c</em>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[*a\nb*]{/}')), [['[', '<em>a<br>b</em>', ']', '<a href="/">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[*a\nb*]]')), [['[', '[', '<em>a<br>b</em>', ']', ']'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser('\nhttp://host')), [['<br>', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp://host')), [['0aAhttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('?http://host')), [['?', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!http://host')), [['0', '<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?http://host')), [['0', '?', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!!http://host')), [['0', '!', '<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?!http://host')), [['0', '?', '<a href="http://host" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!?http://host')), [['0', '!', '?', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<em><a href="http://host" target="_blank">http://host</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host)')), [['<span class="paren">(<a href="http://host" target="_blank">http://host</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('あhttp://hostい')), [['あ', '<a href="http://host" target="_blank">http://host</a>', 'い'], '']);
    });

    it('email', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b')), [['_', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a@b*')), [['<em><a class="email" href="mailto:a@b">a@b</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(a@b)')), [['<span class="paren">(<a class="email" href="mailto:a@b">a@b</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), [[' ', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('++a++b@c++')), [['<ins>a</ins>', '<a class="email" href="mailto:b@c">b@c</a>', '++'], '']);
    });

    it('channel', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a href="/@a?ch=b" class="channel">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#domain/b')), [['@a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#b')), [['<a href="https://domain/@a?ch=b" target="_blank" class="channel">@domain/a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#domain/b')), [['@domain/a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('_@a#b')), [['_', '<a href="/@a?ch=b" class="channel">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), [[' ', '<a href="/@a?ch=b" class="channel">@a#b</a>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a href="/@a" class="account">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a href="/@a" class="account">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em><a href="/@a" class="account">@a</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['<span class="paren">(<a href="/@a" class="account">@a</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<a href="/@a" class="account">@a</a>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#a#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#a#b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a href="/hashtags/a" class="hashtag">#a</a>', '<br>', 'b', '<br>', '<a href="/hashtags/c" class="hashtag">#c</a>', '<br>', '<a class="index" href="#index:d">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##a'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('0a#b')), [['0a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('あい#b')), [['あい#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあ#b')), [['0a', 'あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあい#b')), [['0a', 'あい#b'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<br>', '<a href="/hashtags/b" class="hashtag">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '<span class="linebreak"> </span>', '<a href="/hashtags/b" class="hashtag">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a*#b')), [['<em>a</em>', '<a href="/hashtags/b" class="hashtag">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation">a</sup>', '<a href="/hashtags/b" class="hashtag">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="reference">a</sup>', '<a href="/hashtags/b" class="hashtag">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['[', '<a href="/hashtags/a" class="hashtag">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '<a href="/hashtags/a" class="hashtag">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a href="/hashtags/a" class="hashtag">#a</a>'], '']);
    });

    it('hashref', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashref">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#12345678901234567@a')), [['#12345678901234567@a'], '']);
    });

  });

});
