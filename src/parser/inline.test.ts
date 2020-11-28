import { inline } from './inline';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    const parser = (source: string) => some(inline)(source, {});

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
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
      assert.deepStrictEqual(inspect(parser('*a**b**')), [['*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*a  **b***')), [['<em>a  <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['**', 'a', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b**')), [['**', 'a', '<em>b</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a  *b***')), [['<strong>a  <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**')), [['<strong><em>a</em>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a* b**')), [['<strong><em>a</em> b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*')), [['<em><strong>a</strong>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a** b*')), [['<em><strong>a</strong> b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*')), [['**', '<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**')), [['*', '<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***b')), [['<em><strong>a</strong></em>', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('***a****')), [['<em><strong>a</strong></em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('****a***')), [['****', 'a', '***'], '']);
      assert.deepStrictEqual(inspect(parser('****a****')), [['****', 'a', '****'], '']);
      assert.deepStrictEqual(inspect(parser('*(*a*)*')), [['<em>(<em>a</em>)</em>'], '']);
      assert.deepStrictEqual(inspect(parser('**(**a**)**')), [['<strong>(<strong>a</strong>)</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*++ ++*')), [['<em><ins> </ins></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*++ a ++*')), [['<em><ins> a </ins></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*++  a  ++*')), [['<em><ins>  a  </ins></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<small>`a`</small>*')), [['<em><small><code data-src="`a`">a</code></small></em>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>*<bdi>a</bdi>*</small>')), [['<small><em><bdi>a</bdi></em></small>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>((<bdi>((a))</bdi>))</bdi>')), [['<bdi><sup class="annotation"><bdi>((a))</bdi></sup></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>[[<bdi>[[a]]</bdi>]]</bdi>')), [['<bdi><sup class="reference"><bdi>[[a]]</bdi></sup></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('*[*]')), [['*', '[', '*', ']'], '']);
      assert.deepStrictEqual(inspect(parser('*<*>')), [['<em>&lt;</em>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('*a((b))*')), [['<em>a<sup class="annotation">b</sup></em>'], '']);
      assert.deepStrictEqual(inspect(parser('``a`')), [['``', 'a', '`'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]')), [['[', '<a class="account" href="/@a" rel="noopener">@a</a>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[#1][#2]')), [['<a class="index" href="#index:1">1</a>', '<a class="index" href="#index:2">2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[$1]')), [['[', '$', '1', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$1-2]')), [['[', '$', '1', '-', '2', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[$-1][$-2]')), [['<a class="label" data-label="$-1">$-1</a>', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-1$-2')), [['<a class="label" data-label="$-1">$-1</a>', '<a class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$$-1')), [['$', '<a class="label" data-label="$-1">$-1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#a]]')), [['<sup class="reference"><a class="hashtag" href="/hashtags/a" rel="noopener">#a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[$-1]]')), [['<sup class="reference"><a class="label" data-label="$-1">$-1</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]]{b}')), [['<sup class="reference">#-1</sup>', '<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]](b)')), [['<sup class="reference">#-1</sup>', '(', 'b', ')'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]a]{b}')), [['<a href="b" rel="noopener">[#-1]a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#-1]a](b)')), [['[', '<a class="index" href="#index:-1">-1</a>', 'a', ']', '(', 'b', ')'], '']);
      assert.deepStrictEqual(inspect(parser('[#a]{b}')), [['<a class="index" href="#index:a">a</a>', '<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}')), [['[', '<a class="account" href="/@a" rel="noopener">@a</a>', ']', '<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://evil}')), [['[', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ']', '<a href="http://evil" rel="noopener" target="_blank">http://evil</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://host}')), [['[', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ']', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{{a}}')), [['[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{{a}}')), [['!', '[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[\n]{a}')), [['[', '<br>', ']', '<a href="a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\\n]{a}')), [['[', '<span class="linebreak"> </span>', ']', '<a href="a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['<a href="a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{}')), [['!', '{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('!{a}')), [['<a href="a" rel="noopener" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{a}}')), [['!', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{{a}}}')), [['!', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!!{a}')), [['!', '<a href="a" rel="noopener" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('${a}')), [['$', '<a href="a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('${{a}}')), [['$', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('${{{a}}}')), [['$', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a))')), [['(', '<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))')), [['(', '(', '<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation">((a))</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]')), [['[', '<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]')), [['[', '[', '<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference">[[a]]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[$-1]]]')), [['<sup class="reference"><a class="label" data-label="$-1">$-1</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[]{a}]]')), [['<sup class="reference"><a href="a" rel="noopener">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]{b}]]')), [['<sup class="reference"><a href="b" rel="noopener">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[(([a]{#}))]{#}')), [['<a href="#" rel="noopener">(([a]{#}))</a>'], '']);
      assert.deepStrictEqual(inspect(parser('<http://host>')), [['<', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('<<small>a<</small>')), [['<', '<small>a&lt;</small>'], '']);
      assert.deepStrictEqual(inspect(parser('<sup><sub>a</sub>')), [['<', 'sup', '>', '<sub>a</sub>'], '']);
      assert.deepStrictEqual(inspect(parser('[~http://host')), [['[', '~', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~a@b')), [['[', '~', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[~~a~~]')), [['[', '<del>a</del>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[^http://host')), [['[^', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[^a@b')), [['[^', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a*b\nc*]')), [['[', '<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>', '<em>b<br>c</em>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[*a\nb*]{/}')), [['[', '<em>a<br>b</em>', ']', '<a href="/" rel="noopener">/</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[*a\nb*]]')), [['[', '[', '<em>a<br>b</em>', ']', ']'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser('\nhttp://host')), [['<br>', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\nttp://host')), [['<br>', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0ttp://host')), [['0ttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp://host')), [['0aAhttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAttp://host')), [['0aAttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('?http://host')), [['?', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('?ttp://host')), [['?', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!http://host')), [['0', '<a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!ttp://host')), [['0', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?http://host')), [['0', '?', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?ttp://host')), [['0', '?', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!!http://host')), [['0', '!', '<a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?!http://host')), [['0', '?', '<a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!?http://host')), [['0', '!', '?', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_ttp://host')), [['_', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<em><a href="http://host" rel="noopener" target="_blank">http://host</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host)')), [['(', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' ttp://host')), [[' ', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('あhttp://hostい')), [['あ', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', 'い'], '']);
      assert.deepStrictEqual(inspect(parser('あttp://hostい')), [['あ', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>', 'い'], '']);
    });

    it('email', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b')), [['_', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a@b*')), [['<em><a class="email" href="mailto:a@b" rel="noopener">a@b</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(a@b)')), [['(', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), [[' ', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('++a++b@c++')), [['<ins>a</ins>', '<a class="email" href="mailto:b@c" rel="noopener">b@c</a>', '++'], '']);
    });

    it('channel', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a#domain/b')), [['@a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#b')), [['<a class="channel" href="https://domain/@a?ch=b" rel="noopener" target="_blank">@domain/a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#domain/b')), [['@domain/a#domain/b'], '']);
      assert.deepStrictEqual(inspect(parser('_@a#b')), [['_', '<a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), [[' ', '<a class="channel" href="/@a?ch=b" rel="noopener">@a#b</a>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" href="/@a" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a class="account" href="/@a" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em><a class="account" href="/@a" rel="noopener">@a</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['(', '<a class="account" href="/@a" rel="noopener">@a</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<a class="account" href="/@a" rel="noopener">@a</a>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#a#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#a#b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>', '<br>', 'b', '<br>', '<a class="hashtag" href="/hashtags/c" rel="noopener">#c</a>', '<br>', '<a class="index" href="#index:d">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##a'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('0a#b')), [['0a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('あい#b')), [['あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあ#b')), [['0a', 'あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあい#b')), [['0a', 'あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '<span class="linebreak"> </span>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a*#b')), [['<em>a</em>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation">a</sup>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="reference">a</sup>', '<a class="hashtag" href="/hashtags/b" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['[', '<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a class="hashtag" href="/hashtags/a" rel="noopener">#a</a>'], '']);
    });

    it('hashref', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashref" rel="noopener">#1</a>'], '']);
    });

  });

});
