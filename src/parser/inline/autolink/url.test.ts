import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/url', () => {
  describe('url', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('http')), undefined);
      assert.deepStrictEqual(inspect(parser('ttp')), undefined);
      assert.deepStrictEqual(inspect(parser('http://')), undefined);
      assert.deepStrictEqual(inspect(parser('http://[')), undefined);
      assert.deepStrictEqual(inspect(parser('http://]')), undefined);
      assert.deepStrictEqual(inspect(parser('Http://host')), undefined);
      assert.deepStrictEqual(inspect(parser('http://[::ffff:0:0/96]')), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('http://a')), [['<a href="http://a" rel="noopener" target="_blank">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a:80')), [['<a href="http://a:80" rel="noopener" target="_blank">http://a:80</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a.b')), [['<a href="http://a.b" rel="noopener" target="_blank">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`http://a?#${encodeURIComponent(':/[]()<>?#=& ')}`)), [['<a href="http://a?#%3A%2F%5B%5D()%3C%3E%3F%23%3D%26%20" rel="noopener" target="_blank">http://a?#%3A%2F[]()&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a#()')), [['<a href="http://a#()" rel="noopener" target="_blank">http://a#()</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a#(\n)')), [['<a href="http://a#" rel="noopener" target="_blank">http://a#</a>'], '(\n)']);
      assert.deepStrictEqual(inspect(parser('http://[::]')), [['<a href="http://[::]" rel="noopener" target="_blank">http://[::]</a>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('http://host ')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('http://host. ')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '. ']);
      assert.deepStrictEqual(inspect(parser('http://host\n')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('http://host.\n')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '.\n']);
      assert.deepStrictEqual(inspect(parser('http://host\\')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('http://host.\\')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '.\\']);
      assert.deepStrictEqual(inspect(parser('http://host\\ ')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('http://host.\\ ')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '.\\ ']);
      assert.deepStrictEqual(inspect(parser('http://host\\\n')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('http://host.\\\n')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '.\\\n']);
      assert.deepStrictEqual(inspect(parser('http://host,')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ',']);
      assert.deepStrictEqual(inspect(parser('http://host;')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host.')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('http://host:')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ':']);
      assert.deepStrictEqual(inspect(parser('http://host!')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '!']);
      assert.deepStrictEqual(inspect(parser('http://host?')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '?']);
      assert.deepStrictEqual(inspect(parser('http://host+')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('http://host-')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('http://host*')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '*']);
      assert.deepStrictEqual(inspect(parser('http://host~')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '~']);
      assert.deepStrictEqual(inspect(parser('http://host^')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '^']);
      assert.deepStrictEqual(inspect(parser(`http://host'`)), [['<a href="http://host\'" rel="noopener" target="_blank">http://host\'</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host"')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '"']);
      assert.deepStrictEqual(inspect(parser('http://host`')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '`']);
      assert.deepStrictEqual(inspect(parser('http://host|')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '|']);
      assert.deepStrictEqual(inspect(parser('http://host&')), [['<a href="http://host&amp;" rel="noopener" target="_blank">http://host&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host_')), [['<a href="http://host_" rel="noopener" target="_blank">http://host_</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host$')), [['<a href="http://host$" rel="noopener" target="_blank">http://host$</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://user@host')), [['<a href="http://user@host" rel="noopener" target="_blank">http://user@host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host#@')), [['<a href="http://host#@" rel="noopener" target="_blank">http://host#@</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host[')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '[']);
      assert.deepStrictEqual(inspect(parser('http://host]')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ']']);
      assert.deepStrictEqual(inspect(parser('http://host(')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '(']);
      assert.deepStrictEqual(inspect(parser('http://host)')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('http://host{')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '{']);
      assert.deepStrictEqual(inspect(parser('http://host}')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '}']);
      assert.deepStrictEqual(inspect(parser('http://host<')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '<']);
      assert.deepStrictEqual(inspect(parser('http://host>')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '>']);
      assert.deepStrictEqual(inspect(parser('http://host（')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '（']);
      assert.deepStrictEqual(inspect(parser('http://host）')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '）']);
      assert.deepStrictEqual(inspect(parser('http://host!?**.*--++~~^^')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '!?**.*--++~~^^']);
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser('http://host?&hl;')), [['<a href="http://host?&amp;hl" rel="noopener" target="_blank">http://host?&amp;hl</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host?&hl;&hl;')), [['<a href="http://host?&amp;hl;&amp;hl" rel="noopener" target="_blank">http://host?&amp;hl;&amp;hl</a>'], ';']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser('http://host')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('https://host')), [['<a href="https://host" rel="noopener" target="_blank">https://host</a>'], '']);
    });

  });

});
