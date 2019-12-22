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
      assert.deepStrictEqual(inspect(parser('*a**b**')), [['*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['*', '<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a****')), [['<em><strong>a</strong></em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('****a***')), [['*', '<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('****a****')), [['<em><strong><span class="invalid" data-invalid-syntax="emphasis" data-invalid-type="nesting">*a*</span></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('**[*a*]**')), [['<strong>[<em>a</em>]</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*[**a**]*')), [['<em>[<strong>a</strong>]</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<a>`b`&c; &amp;*')), [['<em><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;a&gt;</span><code data-src="`b`">b</code>&amp;c; &amp;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<small>`a`</small>*')), [['<em><small><code data-src="`a`">a</code></small></em>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>*<bdi>a</bdi>*</small>')), [['<small><em><bdi>a</bdi></em></small>'], '']);
      assert.deepStrictEqual(inspect(parser('*[*]')), [['*', '[*]'], '']);
      assert.deepStrictEqual(inspect(parser('*<*>')), [['<em>&lt;</em>', '&gt;'], '']);
      assert.deepStrictEqual(inspect(parser('*a((b))*')), [['<em>a<sup class="annotation">b</sup></em>'], '']);
      assert.deepStrictEqual(inspect(parser('``a`')), [['`', '`', 'a', '`'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]')), [['[', '<a class="account" rel="noopener">@a</a>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[#1][#2]')), [['<a href="#index:1" rel="noopener" class="index">1</a>', '<a href="#index:2" rel="noopener" class="index">2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[$1]')), [['[$1]'], '']);
      assert.deepStrictEqual(inspect(parser('[$1-2]')), [['[$1-2]'], '']);
      assert.deepStrictEqual(inspect(parser('[$-1][$-2]')), [['<a rel="noopener" class="label" data-label="$-1">$-1</a>', '<a rel="noopener" class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$-1$-2')), [['<a rel="noopener" class="label" data-label="$-1">$-1</a>', '<a rel="noopener" class="label" data-label="$-2">$-2</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[#a]]')), [['<sup class="reference"><a class="hashtag" rel="noopener">#a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[$-1]]')), [['<sup class="reference"><a rel="noopener" class="label" data-label="$-1">$-1</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{}'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['<a href="a" rel="noopener">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{}')), [['!', '{}'], '']);
      assert.deepStrictEqual(inspect(parser('!{a}')), [['<a href="a" rel="noopener" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{a}}')), [['!', '<span class="template">{{a}}</span>'], '']);
    });

    it('link', () => {
      assert.deepStrictEqual(inspect(parser('[#a]{b}')), [['<a href="#index:a" rel="noopener" class="index">a</a>', '<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}')), [['[', '<a class="account" rel="noopener">@a</a>', ']', '<a href="b" rel="noopener">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://host}')), [['[', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ']', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
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
      assert.deepStrictEqual(inspect(parser('0?!http://host')), [['0', '?', '<a href="http://host" rel="noopener" target="_blank"><img class="media" data-src="http://host" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!?http://host')), [['0', '!', '?', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_ttp://host')), [['_', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<em><a href="http://host" rel="noopener" target="_blank">http://host</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host)')), [['(', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' ttp://host')), [[' ', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
    });

    it('email', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b')), [['_', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a@b*')), [['<em><a class="email" href="mailto:a@b" rel="noopener">a@b</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(a@b)')), [['(', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), [[' ', '<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('++a++b@c++')), [['<ins>a</ins>', '<a class="email" href="mailto:b@c" rel="noopener">b@c</a>', '+', '+'], '']);
    });

    it('channel', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a#b')), [['_', '<a class="channel" rel="noopener">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), [[' ', '<a class="channel" rel="noopener">@a#b</a>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em><a class="account" rel="noopener">@a</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['(', '<a class="account" rel="noopener">@a</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<a class="account" rel="noopener">@a</a>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#a#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#a#b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a class="hashtag" rel="noopener">#a</a>', '<br>', 'b', '<br>', '<a class="hashtag" rel="noopener">#c</a>', '<br>', '<a href="#index:d" rel="noopener" class="index">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##a'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<br>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '<span class="linebreak"> </span>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a*#b')), [['<em>a</em>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation">a</sup>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="reference">a</sup>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['[', '<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' [#a')), [[' ', '[', '<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a class="hashtag" rel="noopener">#a</a>'], '']);
    });

    it('hashref', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashref" rel="noopener">#1</a>'], '']);
    });

  });

});
