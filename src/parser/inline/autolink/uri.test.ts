import { loop } from '../../../combinator/loop';
import { uri } from './uri';
import { inspect } from '../../debug.test';

describe('Unit: parser/autolink/uri', () => {
  describe('uri', () => {
    const parser = loop(uri);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('http')), void 0);
      assert.deepStrictEqual(inspect(parser('ttp')), void 0);
      assert.deepStrictEqual(inspect(parser('http:')), void 0);
      assert.deepStrictEqual(inspect(parser('ttp:')), void 0);
      assert.deepStrictEqual(inspect(parser('http://')), void 0);
      assert.deepStrictEqual(inspect(parser('ttp://')), void 0);
      assert.deepStrictEqual(inspect(parser('_http://')), void 0);
      assert.deepStrictEqual(inspect(parser('_ttp://')), void 0);
      assert.deepStrictEqual(inspect(parser('0!ttp://host')), void 0);
      assert.deepStrictEqual(inspect(parser('#')), void 0);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0http'], '://host']);
      assert.deepStrictEqual(inspect(parser('0ttp://host')), [['0ttp'], '://host']);
      assert.deepStrictEqual(inspect(parser('ahttp://host')), [['ahttp'], '://host']);
      assert.deepStrictEqual(inspect(parser('attp://host')), [['attp'], '://host']);
      assert.deepStrictEqual(inspect(parser('Ahttp://host')), [['Ahttp'], '://host']);
      assert.deepStrictEqual(inspect(parser('Attp://host')), [['Attp'], '://host']);
      assert.deepStrictEqual(inspect(parser('!ttp://host')), [['!ttp'], '://host']);
      assert.deepStrictEqual(inspect(parser('?http://host')), [['?http'], '://host']);
      assert.deepStrictEqual(inspect(parser('?ttp://host')), [['?ttp'], '://host']);
      assert.deepStrictEqual(inspect(parser('0!http://host')), [['0!http'], '://host']);
      assert.deepStrictEqual(inspect(parser('0?http://host')), [['0?http'], '://host']);
      assert.deepStrictEqual(inspect(parser('0?!http://host')), [['0?!http'], '://host']);
      assert.deepStrictEqual(inspect(parser('0!?http://host')), [['0!?http'], '://host']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('http://host ')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('http://host\n')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('http://host\\')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('http://host\\ ')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('http://host\\\n')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('http://host,')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ',']);
      assert.deepStrictEqual(inspect(parser('http://host;')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host.')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('http://host:')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], ':']);
      assert.deepStrictEqual(inspect(parser('http://host!')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '!']);
      assert.deepStrictEqual(inspect(parser('http://host?')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '?']);
      assert.deepStrictEqual(inspect(parser('http://host!?')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '!?']);
      assert.deepStrictEqual(inspect(parser('http://host+')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('http://host-')), [['<a href="http://host-" rel="noopener" target="_blank">http://host-</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host*')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '*']);
      assert.deepStrictEqual(inspect(parser('http://host~')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '~']);
      assert.deepStrictEqual(inspect(parser('http://host^')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '^']);
      assert.deepStrictEqual(inspect(parser(`http://host'`)), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], `'`]);
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
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser('http://host?&hl;')), [['<a href="http://host?&amp;hl" rel="noopener" target="_blank">http://host?&amp;hl</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host?&hl;&hl;')), [['<a href="http://host?&amp;hl;&amp;hl" rel="noopener" target="_blank">http://host?&amp;hl;&amp;hl</a>'], ';']);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('http://a')), [['<a href="http://a" rel="noopener" target="_blank">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a.b')), [['<a href="http://a.b" rel="noopener" target="_blank">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a?b=c+d&#')), [['<a href="http://a?b=c+d&amp;#" rel="noopener" target="_blank">http://a?b=c+d&amp;#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a|b')), [['<a href="http://a" rel="noopener" target="_blank">http://a</a>'], '|b']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser('http://host')), [['<a href="http://host" rel="noopener" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('https://host')), [['<a href="https://host" rel="noopener" target="_blank">https://host</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('ttp://host')), [['<a href="http://host" rel="noopener nofollow noreferrer" target="_blank">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('ttps://host')), [['<a href="https://host" rel="noopener nofollow noreferrer" target="_blank">ttps://host</a>'], '']);
    });

    it('section', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<a href="#section:a" rel="noopener">a</a>'], '']);
    });

    it('media', () => {
      assert.deepStrictEqual(inspect(parser('!http://host')), [['<a href="http://host" rel="noopener" target="_blank"><img class="media" data-type="image" src="http://host" alt="" style="max-width: 100%;"></a>'], '']);
      assert.deepStrictEqual(inspect(parser('!https://host')), [['<a href="https://host" rel="noopener" target="_blank"><img class="media" data-type="image" src="https://host" alt="" style="max-width: 100%;"></a>'], '']);
    });

  });

});
