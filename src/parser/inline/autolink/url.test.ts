import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/url', () => {
  describe('url', () => {
    const parser: typeof autolink = (input, output) => some(autolink)((++input.position, input), output);

    it('invalid', () => {
      //assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://[')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' Http://host')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://[::ffff:0:0%1]')), [['<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://[::ffff:0:0/96]')), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://a')), [['<a class="url" href="http://a" target="_blank">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a/')), [['<a class="url" href="http://a/" target="_blank">http://a/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a:80')), [['<a class="url" href="http://a:80" target="_blank">http://a:80</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a.b')), [['<a class="url" href="http://a.b" target="_blank">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(` http://a?#${encodeURIComponent(':/[]()<>?#=& ')}`)), [['<a class="url" href="http://a?#%3A%2F%5B%5D()%3C%3E%3F%23%3D%26%20" target="_blank">http://a?#%3A%2F[]()&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a#()')), [['<a class="url" href="http://a#()" target="_blank">http://a#()</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a#( )')), [['<a class="url" href="http://a#" target="_blank">http://a#</a>'], '( )']);
      assert.deepStrictEqual(inspect(parser, input(' http://a#(\n)')), [['<a class="url" href="http://a#" target="_blank">http://a#</a>'], '(\n)']);
      assert.deepStrictEqual(inspect(parser, input(' http://[::]')), [['<a class="url" href="http://[::]" target="_blank">http://[::]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\rhttp://a#\\')), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\nhttp://a#\\')), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://host ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\a')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\a']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\ ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host. ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '. ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\\')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\\ ')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\ ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\\\n')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host,')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ',']);
      assert.deepStrictEqual(inspect(parser, input(' http://host;')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ';']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.']);
      assert.deepStrictEqual(inspect(parser, input(' http://host:')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ':']);
      assert.deepStrictEqual(inspect(parser, input(' http://host!')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '!']);
      assert.deepStrictEqual(inspect(parser, input(' http://host?')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '?']);
      assert.deepStrictEqual(inspect(parser, input(' http://host+')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '+']);
      assert.deepStrictEqual(inspect(parser, input(' http://host-')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input(' http://host*')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '*']);
      assert.deepStrictEqual(inspect(parser, input(' http://host=')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '=']);
      assert.deepStrictEqual(inspect(parser, input(' http://host~')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '~']);
      assert.deepStrictEqual(inspect(parser, input(' http://host^')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '^']);
      assert.deepStrictEqual(inspect(parser, input(' http://host_')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input(' http://host/')), [['<a class="url" href="http://host/" target="_blank">http://host/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host//')), [['<a class="url" href="http://host//" target="_blank">http://host//</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host///')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '///']);
      assert.deepStrictEqual(inspect(parser, input(` http://host'`)), [[`<a class="url" href="http://host'" target="_blank">http://host'</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host"')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '"']);
      assert.deepStrictEqual(inspect(parser, input(' http://host`')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '`']);
      assert.deepStrictEqual(inspect(parser, input(' http://host|')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '|']);
      assert.deepStrictEqual(inspect(parser, input(' http://host&')), [['<a class="url" href="http://host&amp;" target="_blank">http://host&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host$')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '$']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#"$"')), [['<a class="url" href="http://host#" target="_blank">http://host#</a>'], '"$"']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#($)')), [['<a class="url" href="http://host#" target="_blank">http://host#</a>'], '($)']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#(($))')), [['<a class="url" href="http://host#" target="_blank">http://host#</a>'], '(($))']);
      assert.deepStrictEqual(inspect(parser, input(' http://user@host')), [['<a class="url" href="http://user@host" target="_blank">http://user@host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#@')), [['<a class="url" href="http://host#@" target="_blank">http://host#@</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host[')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '[']);
      assert.deepStrictEqual(inspect(parser, input(' http://host]')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ']']);
      assert.deepStrictEqual(inspect(parser, input(' http://host(')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '(']);
      assert.deepStrictEqual(inspect(parser, input(' http://host)')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ')']);
      assert.deepStrictEqual(inspect(parser, input(' http://host{')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '{']);
      assert.deepStrictEqual(inspect(parser, input(' http://host}')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '}']);
      assert.deepStrictEqual(inspect(parser, input(' http://host<')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '<']);
      assert.deepStrictEqual(inspect(parser, input(' http://host>')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '>']);
      assert.deepStrictEqual(inspect(parser, input(' http://host（')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '（']);
      assert.deepStrictEqual(inspect(parser, input(' http://host）')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '）']);
      assert.deepStrictEqual(inspect(parser, input(` http://host${'+'.repeat(5e5)}`)), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '+'.repeat(5e5)]);
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://host?&hl;')), [['<a class="url" href="http://host?&amp;hl" target="_blank">http://host?&amp;hl</a>'], ';']);
      assert.deepStrictEqual(inspect(parser, input(' http://host?&hl;&hl;')), [['<a class="url" href="http://host?&amp;hl;&amp;hl" target="_blank">http://host?&amp;hl;&amp;hl</a>'], ';']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://host')), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' https://host')), [['<a class="url" href="https://host" target="_blank">https://host</a>'], '']);
    });

  });

});
