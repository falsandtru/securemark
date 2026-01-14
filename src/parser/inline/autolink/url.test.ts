import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/url', () => {
  describe('url', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('http')), [['http'], '']);
      assert.deepStrictEqual(inspect(parser('ttp')), [['ttp'], '']);
      assert.deepStrictEqual(inspect(parser('http://')), [['http'], '://']);
      assert.deepStrictEqual(inspect(parser('http://[')), [['http'], '://[']);
      assert.deepStrictEqual(inspect(parser('http://]')), [['http'], '://]']);
      assert.deepStrictEqual(inspect(parser('Http://host')), [['Http'], '://host']);
      //assert.deepStrictEqual(inspect(parser('http://[::ffff:0:0%1]')), [['<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      //assert.deepStrictEqual(inspect(parser('http://[::ffff:0:0/96]')), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' http://host')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('http://a')), [['<a class="url" href="http://a" target="_blank">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a:80')), [['<a class="url" href="http://a:80" target="_blank">http://a:80</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a.b')), [['<a class="url" href="http://a.b" target="_blank">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`http://a?#${encodeURIComponent(':/[]()<>?#=& ')}`)), [['<a class="url" href="http://a?#%3A%2F%5B%5D()%3C%3E%3F%23%3D%26%20" target="_blank">http://a?#%3A%2F[]()&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a#()')), [['<a class="url" href="http://a#()" target="_blank">http://a#()</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a#( )')), [['<a class="url" href="http://a#" target="_blank">http://a#</a>'], '( )']);
      assert.deepStrictEqual(inspect(parser('http://a#(\n)')), [['<a class="url" href="http://a#" target="_blank">http://a#</a>'], '(\n)']);
      assert.deepStrictEqual(inspect(parser('http://[::]')), [['<a class="url" href="http://[::]" target="_blank">http://[::]</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\rhttp://a#\\')), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser('\rhttp://a#\\\nhttp://b#\\')), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>', '<br>', '<a class="url" href="http://b#\\" target="_blank">http://b#\\</a>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('http://host ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('http://host. ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '. ']);
      assert.deepStrictEqual(inspect(parser('http://host\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('http://host.\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\n']);
      assert.deepStrictEqual(inspect(parser('http://host\\')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('http://host.\\')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\']);
      assert.deepStrictEqual(inspect(parser('http://host\\ ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('http://host.\\ ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\ ']);
      assert.deepStrictEqual(inspect(parser('http://host\\\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('http://host.\\\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\\n']);
      assert.deepStrictEqual(inspect(parser('http://host,')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ',']);
      assert.deepStrictEqual(inspect(parser('http://host;')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host.')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('http://host:')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ':']);
      assert.deepStrictEqual(inspect(parser('http://host!')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '!']);
      assert.deepStrictEqual(inspect(parser('http://host?')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '?']);
      assert.deepStrictEqual(inspect(parser('http://host+')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('http://host-')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('http://host*')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '*']);
      assert.deepStrictEqual(inspect(parser('http://host=')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '=']);
      assert.deepStrictEqual(inspect(parser('http://host~')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '~']);
      assert.deepStrictEqual(inspect(parser('http://host^')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '^']);
      assert.deepStrictEqual(inspect(parser(`http://host'`)), [['<a class="url" href="http://host\'" target="_blank">http://host\'</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host"')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '"']);
      assert.deepStrictEqual(inspect(parser('http://host`')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '`']);
      assert.deepStrictEqual(inspect(parser('http://host|')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '|']);
      assert.deepStrictEqual(inspect(parser('http://host&')), [['<a class="url" href="http://host&amp;" target="_blank">http://host&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host_')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('http://host$')), [['<a class="url" href="http://host$" target="_blank">http://host$</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://user@host')), [['<a class="url" href="http://user@host" target="_blank">http://user@host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host#@')), [['<a class="url" href="http://host#@" target="_blank">http://host#@</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host[')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '[']);
      assert.deepStrictEqual(inspect(parser('http://host]')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ']']);
      assert.deepStrictEqual(inspect(parser('http://host(')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '(']);
      assert.deepStrictEqual(inspect(parser('http://host)')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('http://host{')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '{']);
      assert.deepStrictEqual(inspect(parser('http://host}')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '}']);
      assert.deepStrictEqual(inspect(parser('http://host<')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '<']);
      assert.deepStrictEqual(inspect(parser('http://host>')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '>']);
      assert.deepStrictEqual(inspect(parser('http://host（')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '（']);
      assert.deepStrictEqual(inspect(parser('http://host）')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '）']);
      assert.deepStrictEqual(inspect(parser('http://host\\"')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\"']);
      assert.deepStrictEqual(inspect(parser('http://host!?**.*--++==~~^^')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '!?**.*--++==~~^^']);
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser('http://host?&hl;')), [['<a class="url" href="http://host?&amp;hl" target="_blank">http://host?&amp;hl</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host?&hl;&hl;')), [['<a class="url" href="http://host?&amp;hl;&amp;hl" target="_blank">http://host?&amp;hl;&amp;hl</a>'], ';']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser('http://host')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('https://host')), [['<a class="url" href="https://host" target="_blank">https://host</a>'], '']);
    });

  });

});
