import { loop } from '../../combinator/loop';
import { uri } from './autolink.uri';
import { inspect } from '../debug.test';

describe('Unit: parser/autolink.uri', () => {
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
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('0http://host')), [['0ht'], 'tp://host']);
      assert.deepStrictEqual(inspect(parser('0ttp://host')), [['0tt'], 'p://host']);
      assert.deepStrictEqual(inspect(parser('ahttp://host')), [['aht'], 'tp://host']);
      assert.deepStrictEqual(inspect(parser('attp://host')), [['att'], 'p://host']);
      assert.deepStrictEqual(inspect(parser('Ahttp://host')), [['Aht'], 'tp://host']);
      assert.deepStrictEqual(inspect(parser('Attp://host')), [['Att'], 'p://host']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('http://host ')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('http://host\n')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('http://host\\')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('http://host\\ ')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('http://host\\\n')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('http://host,')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], ',']);
      assert.deepStrictEqual(inspect(parser('http://host;')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host.')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('http://host:')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], ':']);
      assert.deepStrictEqual(inspect(parser('http://host!')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '!']);
      assert.deepStrictEqual(inspect(parser('http://host?')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '?']);
      assert.deepStrictEqual(inspect(parser('http://host!?')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '!?']);
      assert.deepStrictEqual(inspect(parser('http://host+')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('http://host-')), [['<a href="http://host-" target="_blank" rel="noopener">http://host-</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host*')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '*']);
      assert.deepStrictEqual(inspect(parser('http://host~')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '~']);
      assert.deepStrictEqual(inspect(parser('http://host^')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '^']);
      assert.deepStrictEqual(inspect(parser(`http://host'`)), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], `'`]);
      assert.deepStrictEqual(inspect(parser('http://host"')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '"']);
      assert.deepStrictEqual(inspect(parser('http://host`')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '`']);
      assert.deepStrictEqual(inspect(parser('http://host|')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '|']);
      assert.deepStrictEqual(inspect(parser('http://host&')), [['<a href="http://host&amp;" target="_blank" rel="noopener">http://host&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host_')), [['<a href="http://host_" target="_blank" rel="noopener">http://host_</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host$')), [['<a href="http://host$" target="_blank" rel="noopener">http://host$</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://user@host')), [['<a href="http://user@host" target="_blank" rel="noopener">http://user@host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host#@')), [['<a href="http://host#@" target="_blank" rel="noopener">http://host#@</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://host[')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '[']);
      assert.deepStrictEqual(inspect(parser('http://host]')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], ']']);
      assert.deepStrictEqual(inspect(parser('http://host(')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '(']);
      assert.deepStrictEqual(inspect(parser('http://host)')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('http://host{')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '{']);
      assert.deepStrictEqual(inspect(parser('http://host}')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '}']);
      assert.deepStrictEqual(inspect(parser('http://host<')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '<']);
      assert.deepStrictEqual(inspect(parser('http://host>')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '>']);
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser('http://host?&hl;')), [['<a href="http://host?&amp;hl" target="_blank" rel="noopener">http://host?&amp;hl</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('http://host?&hl;&hl;')), [['<a href="http://host?&amp;hl;&amp;hl" target="_blank" rel="noopener">http://host?&amp;hl;&amp;hl</a>'], ';']);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('http://a')), [['<a href="http://a" target="_blank" rel="noopener">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a.b')), [['<a href="http://a.b" target="_blank" rel="noopener">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a?b=c+d&#')), [['<a href="http://a?b=c+d&amp;#" target="_blank" rel="noopener">http://a?b=c+d&amp;#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('http://a|b')), [['<a href="http://a" target="_blank" rel="noopener">http://a</a>'], '|b']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser('http://host')), [['<a href="http://host" target="_blank" rel="noopener">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('https://host')), [['<a href="https://host" target="_blank" rel="noopener">https://host</a>'], '']);
    });

    it('nofollow', () => {
      assert.deepStrictEqual(inspect(parser('ttp://host')), [['<a href="http://host" target="_blank" rel="noopener nofollow noreferrer">ttp://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser('ttps://host')), [['<a href="https://host" target="_blank" rel="noopener nofollow noreferrer">ttps://host</a>'], '']);
    });

  });

});
