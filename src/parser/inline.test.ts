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
      assert.deepStrictEqual(inspect(parser('* a*')), [['*', ' ', 'a', '*'], '']);
      assert.deepStrictEqual(inspect(parser('** a**')), [['**', ' ', 'a', '**'], '']);
      assert.deepStrictEqual(inspect(parser('*** a***')), [['***', ' ', 'a', '***'], '']);
      assert.deepStrictEqual(inspect(parser('**** a****')), [['****', ' ', 'a', '****'], '']);
      assert.deepStrictEqual(inspect(parser('*a**')), [['<em>a</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b')), [['*', 'a', '**', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*')), [['*', 'a', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*c')), [['*', 'a', '**', 'b', '*', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*c*')), [['*', 'a', '**', 'b', '<em>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**')), [['*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c')), [['*', 'a', '<strong>b</strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b***')), [['<em>a<strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b***c')), [['<em>a<strong>b</strong></em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b****')), [['<em>a<strong>b</strong></em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b****c')), [['*', 'a', '<strong>b</strong>', '**', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a***b****')), [['<em>a</em>', '<strong>b</strong>', '**'], '']);
      assert.deepStrictEqual(inspect(parser('*a***b****c')), [['<em>a</em>', '<strong>b</strong>', '**', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a *b**')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a *b**c')), [['*', 'a', ' ', '*', 'b', '**', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a **b***')), [['<em>a <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a **b***c')), [['<em>a <strong>b</strong></em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('*a ***b****')), [['<em>a <em><strong>b</strong></em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a ***b****c')), [['<em>a <em><strong>b</strong></em></em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['**', 'a', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b**')), [['**', 'a', '<em>b</em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b**c')), [['**', 'a', '*', 'b', '**', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b***')), [['<strong>a<em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b***c')), [['<strong>a<em>b</em></strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a**b****')), [['<strong>a</strong>', 'b', '****'], '']);
      assert.deepStrictEqual(inspect(parser('**a**b****c')), [['<strong>a</strong>', 'b', '****', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a***b*****')), [['<strong>a</strong>', '<em>b</em>', '****'], '']);
      assert.deepStrictEqual(inspect(parser('**a***b*****c')), [['<strong>a</strong>', '<em>b</em>', '****', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a *b***')), [['<strong>a <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a *b***c')), [['<strong>a <em>b</em></strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a **b****')), [['<strong>a <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a **b****c')), [['<strong>a <strong>b</strong></strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a ***b*****')), [['<strong>a <em><strong>b</strong></em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a ***b*****c')), [['<strong>a <em><strong>b</strong></em></strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**')), [['<strong><em>a</em>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**c')), [['<strong><em>a</em>b</strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*c***')), [['<strong><em>a</em>b<em>c</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b*c***d')), [['<strong><em>a</em>b<em>c</em></strong>', 'd'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b**c****')), [['<strong><em>a</em>b</strong>', 'c', '****'], '']);
      assert.deepStrictEqual(inspect(parser('***a* **b****')), [['<strong><em>a</em> <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*\\ **b****')), [['<strong><em>a</em> <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*&Tab;**b****')), [['<strong><em>a</em>\t<strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*<wbr>**b****')), [['<strong><em>a</em><wbr><strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('***a *b****')), [['<em><strong>a <em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\ *b****')), [['<em><strong>a <em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a&Tab;*b****')), [['<em><strong>a\t<em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a<wbr>*b****')), [['<em><strong>a<wbr><em>b</em></strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b **')), [['**', '<em>a</em>', 'b', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser('***a*b\\ **')), [['**', '<em>a</em>', 'b', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*')), [['<em><strong>a</strong>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*c')), [['<em><strong>a</strong>b</em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b*c**')), [['<em><strong>a</strong>b</em>', 'c', '**'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c***')), [['<em><strong>a</strong>b<strong>c</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c***d')), [['<em><strong>a</strong>b<strong>c</strong></em>', 'd'], '']);
      assert.deepStrictEqual(inspect(parser('***a** *b**')), [['<em><strong>a</strong> <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**\\ *b**')), [['<em><strong>a</strong> <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**&Tab;*b**')), [['<em><strong>a</strong>\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**<wbr>*b**')), [['<em><strong>a</strong><wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a **b*')), [['***', 'a', ' ', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a\\ **b*')), [['***', 'a', ' ', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b *')), [['*', '<strong>a</strong>', 'b', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b\\ *')), [['*', '<strong>a</strong>', 'b', ' ', '*'], '']);
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
      assert.deepStrictEqual(inspect(parser('*<bdi>`a`</bdi>*')), [['<em><bdi><code data-src="`a`">a</code></bdi></em>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>*<bdi>a</bdi>*</bdi>')), [['<bdi><em><bdi>a</bdi></em></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>((<bdi>((a))</bdi>))</bdi>')), [['<bdi><sup class="annotation"><span><bdi><span class="paren">((a))</span></bdi></span></sup></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('<bdi>[[<bdi>[[a]]</bdi>]]</bdi>')), [['<bdi><sup class="reference"><span><bdi>[[a]]</bdi></span></sup></bdi>'], '']);
      assert.deepStrictEqual(inspect(parser('*[*]')), [['*', '[', '*', ']'], '']);
      assert.deepStrictEqual(inspect(parser('*<*>')), [['<em>&lt;</em>', '>'], '']);
      assert.deepStrictEqual(inspect(parser('*a((b))*')), [['<em>a<sup class="annotation"><span>b</span></sup></em>'], '']);
      assert.deepStrictEqual(inspect(parser('++\na\n++\n~~\nb\n~~\nc')), [['<ins><br>a</ins>', '<br>', '<del><br>b</del>', '<br>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('``a`')), [['``', 'a', '`'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]')), [['[', '<a class="account" href="/@a">@a</a>', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[#1][#2]')), [['<a class="index" href="#index::1">1</a>', '<a class="index" href="#index::2">2</a>'], '']);
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
      assert.deepStrictEqual(inspect(parser('[[#-1]a](b)')), [['[', '<a class="index" href="#index::-1">-1</a>', 'a', ']', '(', 'b', ')'], '']);
      assert.deepStrictEqual(inspect(parser('[#a]{b}')), [['<a class="index" href="#index::a">a</a>', '<a class="url" href="b">b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a]{b}')), [['<a class="link" href="b">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://evil}')), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host]{http://host}')), [['<a class="invalid">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[]{{a}}')), [['[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('![]{{a}}')), [['!', '[', ']', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[\n]{a}')), [['[', '<br>', ']', '<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[\\\n]{a}')), [['[', '<br>', ']', '<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['<a class="url" href="a">a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('\r!{}')), [['!', '{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('\r!{a}')), [['<a href="a" target="_blank"><img class="media" data-src="a" alt=""></a>'], '']);
      assert.deepStrictEqual(inspect(parser('\r!{{a}}')), [['!', '<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('\r!{{{a}}}')), [['!', '<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('\r!!{a}')), [['!', '!', '<a class="url" href="a">a</a>'], '']);
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
      assert.deepStrictEqual(inspect(parser('"[% "*"* %]')), [['"', '<span class="remark"><input type="checkbox"><span>[% "*"* %]</span></span>'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser('\nhttp://host')), [['<br>', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp://host')), [['0aAhttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('?http://host')), [['?', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0!http://host')), [['0', '!', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0?http://host')), [['0', '?', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host_')), [['_', '<a class="url" href="http://host" target="_blank">http://host</a>', '_'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<em><a class="url" href="http://host" target="_blank">http://host</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host)')), [['<span class="paren">(<a class="url" href="http://host" target="_blank">http://host</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('あhttp://hostい')), [['あ', '<a class="url" href="http://host" target="_blank">http://host</a>', 'い'], '']);
    });

    it('email', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b')), [['_', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a@b_')), [['_', '<a class="email" href="mailto:a@b">a@b</a>', '_'], '']);
      assert.deepStrictEqual(inspect(parser('_a_b@c_')), [['_', '<a class="email" href="mailto:a_b@c">a_b@c</a>', '_'], '']);
      assert.deepStrictEqual(inspect(parser('*a@b*')), [['<em><a class="email" href="mailto:a@b">a@b</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(a@b)')), [['<span class="paren">(<a class="email" href="mailto:a@b">a@b</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' a@b')), [[' ', '<a class="email" href="mailto:a@b">a@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('++a++b@c++')), [['<ins>a</ins>', '<a class="email" href="mailto:b@c">b@c</a>', '++'], '']);
    });

    it('channel', () => {
      assert.deepStrictEqual(inspect(parser('@a#b')), [['<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain/a#b')), [['<a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a#b')), [['_', '<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a#b_')), [['_', '<a class="channel" href="/@a?ch=b">@a#b</a>', '_'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#b')), [[' ', '<a class="channel" href="/@a?ch=b">@a#b</a>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_@a_')), [['_', '<a class="account" href="/@a">@a</a>', '_'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em><a class="account" href="/@a">@a</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['<span class="paren">(<a class="account" href="/@a">@a</a>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<a class="account" href="/@a">@a</a>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#a#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#a#b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a class="hashtag" href="/hashtags/a">#a</a>', '<br>', 'b', '<br>', '<a class="hashtag" href="/hashtags/c">#c</a>', '<br>', '<a class="index" href="#index::d">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##a'], '']);
      assert.deepStrictEqual(inspect(parser('_#a')), [['_#a'], '']);
      assert.deepStrictEqual(inspect(parser('_#a_')), [['_#a', '_'], '']);
      assert.deepStrictEqual(inspect(parser('_#a_b')), [['_#a_b'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('0a#b')), [['0a#b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser('あい#b')), [['あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあ#b')), [['0aあ#b'], '']);
      assert.deepStrictEqual(inspect(parser('0aあい#b')), [['0a', 'あ', 'い#b'], '']);
      assert.deepStrictEqual(inspect(parser('「#あ」')), [['「', '<a class="hashtag" href="/hashtags/あ">#あ</a>', '」'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '<br>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_a_#b')), [['_', 'a_#b'], '']);
      assert.deepStrictEqual(inspect(parser('*a*#b')), [['<em>a</em>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation"><span>a</span></sup>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="reference"><span>a</span></sup>', '<a class="hashtag" href="/hashtags/b">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['', '[', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
    });

    it('hashnum', () => {
      assert.deepStrictEqual(inspect(parser('#1')), [['<a class="hashnum">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1234567890@a')), [['#1234567890@a'], '']);
      assert.deepStrictEqual(inspect(parser('_#1')), [['_#1'], '']);
      assert.deepStrictEqual(inspect(parser('_#1_')), [['_#1_'], '']);
      assert.deepStrictEqual(inspect(parser('_#1_0')), [['_#1_0'], '']);
      assert.deepStrictEqual(inspect(parser('「#1」')), [['「', '<a class="hashnum">#1</a>', '」'], '']);
    });

  });

});
