import { inline } from './inline';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    const parser = some(inline);

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*a**b**')), [['*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*')), [['*', '<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('****a***')), [['*', '<em><strong>a</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a****')), [['<em><strong>a</strong></em>', '*'], '']);
      assert.deepStrictEqual(inspect(parser('**[*a*]**')), [['<strong>[<em>a</em>]</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*[**a**]*')), [['<em>[<strong>a</strong>]</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<a>`b`&c;&amp; *')), [['<em>&lt;a&gt;<code data-src="`b`">b</code>&amp;c;&amp; </em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<small>`a`</small>*')), [['<em><small><code data-src="`a`">a</code></small></em>'], '']);
      assert.deepStrictEqual(inspect(parser('<small>*<mark>a</mark>*</small>')), [['<small><em><mark>a</mark></em></small>'], '']);
    });

    it('link', () => {
      assert.deepStrictEqual(inspect(parser('[http://host](http://host)')), [['[', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ']', '(', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ')'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' ttp://host')), [[' ', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\nhttp://host')), [['<span class="linebreak"> <wbr></span>', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\nttp://host')), [['<span class="linebreak"> <wbr></span>', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0ttp://host')), [['0ttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp://host')), [['0a', 'Ahttp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAttp://host')), [['0a', 'Attp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_ttp://host')), [['_', '<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<em><a href="http://host" rel="noopener" target="_blank">http://host</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('0!http://host')), [['0!http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host)')), [['(', '<a href="http://host" rel="noopener" target="_blank">http://host</a>', ')'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['a@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em><a class="account" rel="noopener">@a</a></em>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['(', '<a class="account" rel="noopener">@a</a>', ')'], '']);
    });

  });

});
