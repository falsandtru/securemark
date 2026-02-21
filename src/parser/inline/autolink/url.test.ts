import { inline } from '../../inline';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/url', () => {
  describe('url', () => {
    const parser = (source: string) => some(inline)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' http'), ctx), [[' ', 'http'], '']);
      assert.deepStrictEqual(inspect(parser(' ttp'), ctx), [[' ', 'ttp'], '']);
      assert.deepStrictEqual(inspect(parser(' http://'), ctx), [[' ', 'http', ':', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser(' http://['), ctx), [[' ', 'http', ':', '/', '/', '['], '']);
      assert.deepStrictEqual(inspect(parser(' http://]'), ctx), [[' ', 'http', ':', '/', '/', ']'], '']);
      assert.deepStrictEqual(inspect(parser(' Http://host'), ctx), [[' ', 'Http', ':', '/', '/', 'host'], '']);
      assert.deepStrictEqual(inspect(parser(' http://[::ffff:0:0%1]'), ctx), [[' ', '<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://[::ffff:0:0/96]'), ctx), [[' ', '<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser(' http://a'), ctx), [[' ', '<a class="url" href="http://a" target="_blank">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://a/'), ctx), [[' ', '<a class="url" href="http://a/" target="_blank">http://a/</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://a:80'), ctx), [[' ', '<a class="url" href="http://a:80" target="_blank">http://a:80</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://a.b'), ctx), [[' ', '<a class="url" href="http://a.b" target="_blank">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(` http://a?#${encodeURIComponent(':/[]()<>?#=& ')}`), ctx), [[' ', '<a class="url" href="http://a?#%3A%2F%5B%5D()%3C%3E%3F%23%3D%26%20" target="_blank">http://a?#%3A%2F[]()&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://a#()'), ctx), [[' ', '<a class="url" href="http://a#()" target="_blank">http://a#()</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://a#( )'), ctx), [[' ', '<a class="url" href="http://a#" target="_blank">http://a#</a>', '<span class="paren">( )</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://a#(\n)'), ctx), [[' ', '<a class="url" href="http://a#" target="_blank">http://a#</a>', '<span class="paren">(<br>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://[::]'), ctx), [[' ', '<a class="url" href="http://[::]" target="_blank">http://[::]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a#\\'), ctx), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a#\\\nhttp://b#\\'), ctx), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>', '<br>', '<a class="url" href="http://b#\\" target="_blank">http://b#\\</a>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser(' http://host '), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host. '), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '.'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host\n'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host.\n'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '.', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host\\'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host.\\'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '.'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host\\ '), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' http://host.\\ '), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '.', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' http://host\\\n'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host.\\\n'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '.', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host,'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', ','], '']);
      assert.deepStrictEqual(inspect(parser(' http://host;'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', ';'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host.'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '.'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host:'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', ':'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host!'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '!'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host?'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '?'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host+'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '+'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host-'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '-'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host*'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '*'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host='), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '='], '']);
      assert.deepStrictEqual(inspect(parser(' http://host~'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '~'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host^'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '^'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host_'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '_'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host/'), ctx), [[' ', '<a class="url" href="http://host/" target="_blank">http://host/</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host//'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '/', '/'], '']);
      assert.deepStrictEqual(inspect(parser(` http://host'`), ctx), [[' ', '<a class="url" href="http://host\'" target="_blank">http://host\'</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host"'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '"'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host`'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '`'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host|'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '|'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host&'), ctx), [[' ', '<a class="url" href="http://host&amp;" target="_blank">http://host&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host$'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '$'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host#"$"'), ctx), [[' ', '<a class="url" href="http://host#" target="_blank">http://host#</a>', '"', '$', '"'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host#($)'), ctx), [[' ', '<a class="url" href="http://host#" target="_blank">http://host#</a>', '<span class="paren">($)</span>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host#(($))'), ctx), [[' ', '<a class="url" href="http://host#" target="_blank">http://host#</a>', '<sup class="annotation"><span>$</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://user@host'), ctx), [[' ', '<a class="url" href="http://user@host" target="_blank">http://user@host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host#@'), ctx), [[' ', '<a class="url" href="http://host#@" target="_blank">http://host#@</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host['), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '['], '']);
      assert.deepStrictEqual(inspect(parser(' http://host]'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', ']'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host('), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '('], '']);
      assert.deepStrictEqual(inspect(parser(' http://host)'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', ')'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host{'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '{'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host}'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '}'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host<'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '<'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host>'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host（'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '（'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host）'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '）'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host\\"'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>', '"'], '']);
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser(' http://host?&hl;'), ctx), [[' ', '<a class="url" href="http://host?&amp;hl" target="_blank">http://host?&amp;hl</a>', ';'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host?&hl;&hl;'), ctx), [[' ', '<a class="url" href="http://host?&amp;hl;&amp;hl" target="_blank">http://host?&amp;hl;&amp;hl</a>', ';'], '']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser(' http://host'), ctx), [[' ', '<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' https://host'), ctx), [[' ', '<a class="url" href="https://host" target="_blank">https://host</a>'], '']);
    });

  });

});
