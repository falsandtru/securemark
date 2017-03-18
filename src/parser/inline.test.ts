﻿import { loop } from '../combinator/loop';
import { inline } from './inline';
import { inspect } from './debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    const parser = loop(inline);

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('++<a>`b`&c;&amp; ++')), [['<ins>&lt;a&gt;<code>b</code>&amp;c;&amp; </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<ruby>`a`</ruby>~~')), [['<del><ruby><code>a</code></ruby></del>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>~~<mark>a</mark>~~</ruby>')), [['<ruby><del><mark>a</mark></del></ruby>'], '']);
    });

    it('flip', () => {
      assert.deepStrictEqual(inspect(parser('**~~*<a>*~~**')), [['<strong><del><em>&lt;a&gt;</em></del></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*~~**<a>**~~*')), [['<em><del><strong>&lt;a&gt;</strong></del></em>'], '']);
    });

    it('link', () => {
      assert.deepStrictEqual(inspect(parser('[http://host](http://host)')), [['[', '<a href="http://host" target="_blank" rel="noopener">http://host</a>', ']', '(', '<a href="http://host" target="_blank" rel="noopener">http://host</a>', ')'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser(' http://host')), [[' ', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' ttp://host')), [[' ', '<a href="http://host" target="_blank" rel="noopener nofollow noreferrer">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\nhttp://host')), [[' ', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\nttp://host')), [[' ', '<a href="http://host" target="_blank" rel="noopener nofollow noreferrer">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0ht', 'tp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0ttp://host')), [['0tt', 'p', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp://host')), [['0a', 'Aht', 'tp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('0aAttp://host')), [['0a', 'Att', 'p', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('_http://host')), [['_', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('_ttp://host')), [['_', '<a href="http://host" target="_blank" rel="noopener nofollow noreferrer">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('$http://host')), [['$', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`'http://host`)), [[`'`, '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('"http://host')), [['"', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('`http://host')), [['`', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('|http://host')), [['|', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('&http://host')), [['&', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('[http://host')), [['[', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(']http://host')), [[']', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('(http://host')), [['(', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(')http://host')), [[')', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('{http://host')), [['{', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('}http://host')), [['}', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('<http://host')), [['<', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('>http://host')), [['>', '<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('**http://host**')), [['<strong><a href="http://host" target="_blank" rel="noopener">http://host</a></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*http://host*')), [['<em><a href="http://host" target="_blank" rel="noopener">http://host</a></em>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['a@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a@http://host')), [['a@ht', 'tp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('a@ttp://host')), [['a@t', 'tp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a@@http://host')), [['a@@ht', 'tp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('a@@ttp://host')), [['a@@t', 'tp', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('$@a')), [['$', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n@a')), [[' ', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser(`'@a`)), [[`'`, '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('"@a')), [['"', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('`@a')), [['`', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('|@a')), [['|', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('&@a')), [['&', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('[@a')), [['[', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser(']@a')), [[']', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a')), [['(', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser(')@a')), [[')', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{@a')), [['{', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('}@a')), [['}', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('<@a')), [['<', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('>@a')), [['>', '<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('**@a**')), [['<strong><span class="account">@a</span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em><span class="account">@a</span></em>'], '']);
    });

  });

});
