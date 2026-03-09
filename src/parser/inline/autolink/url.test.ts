import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { Input, input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/url', () => {
  describe('url', () => {
    const parser = (input: Input<Context>) => some(autolink)((++input.context.position, input));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://[', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' Http://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' http://[::ffff:0:0%1]', new Context())), [['<a class="invalid">http://[::ffff:0:0%1]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://[::ffff:0:0/96]', new Context())), [['<a class="invalid">http://[::ffff:0:0/96]</a>'], '']);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://a', new Context())), [['<a class="url" href="http://a" target="_blank">http://a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a/', new Context())), [['<a class="url" href="http://a/" target="_blank">http://a/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a:80', new Context())), [['<a class="url" href="http://a:80" target="_blank">http://a:80</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a.b', new Context())), [['<a class="url" href="http://a.b" target="_blank">http://a.b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(` http://a?#${encodeURIComponent(':/[]()<>?#=& ')}`, new Context())), [['<a class="url" href="http://a?#%3A%2F%5B%5D()%3C%3E%3F%23%3D%26%20" target="_blank">http://a?#%3A%2F[]()&lt;&gt;%3F%23%3D%26%20</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a#()', new Context())), [['<a class="url" href="http://a#()" target="_blank">http://a#()</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://a#( )', new Context())), [['<a class="url" href="http://a#" target="_blank">http://a#</a>'], '( )']);
      assert.deepStrictEqual(inspect(parser, input(' http://a#(\n)', new Context())), [['<a class="url" href="http://a#" target="_blank">http://a#</a>'], '(\n)']);
      assert.deepStrictEqual(inspect(parser, input(' http://[::]', new Context())), [['<a class="url" href="http://[::]" target="_blank">http://[::]</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\rhttp://a#\\', new Context())), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\nhttp://a#\\', new Context())), [['<a class="url" href="http://a#\\" target="_blank">http://a#\\</a>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://host ', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\n', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\a', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\a']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\ ', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host\\\n', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host. ', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '. ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\n', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\\', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\\ ', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\ ']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.\\\n', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.\\\n']);
      assert.deepStrictEqual(inspect(parser, input(' http://host,', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ',']);
      assert.deepStrictEqual(inspect(parser, input(' http://host;', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ';']);
      assert.deepStrictEqual(inspect(parser, input(' http://host.', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '.']);
      assert.deepStrictEqual(inspect(parser, input(' http://host:', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ':']);
      assert.deepStrictEqual(inspect(parser, input(' http://host!', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '!']);
      assert.deepStrictEqual(inspect(parser, input(' http://host?', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '?']);
      assert.deepStrictEqual(inspect(parser, input(' http://host+', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '+']);
      assert.deepStrictEqual(inspect(parser, input(' http://host-', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input(' http://host*', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '*']);
      assert.deepStrictEqual(inspect(parser, input(' http://host=', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '=']);
      assert.deepStrictEqual(inspect(parser, input(' http://host~', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '~']);
      assert.deepStrictEqual(inspect(parser, input(' http://host^', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '^']);
      assert.deepStrictEqual(inspect(parser, input(' http://host_', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input(' http://host/', new Context())), [['<a class="url" href="http://host/" target="_blank">http://host/</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host//', new Context())), [['<a class="url" href="http://host//" target="_blank">http://host//</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host///', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '///']);
      assert.deepStrictEqual(inspect(parser, input(` http://host'`, new Context())), [[`<a class="url" href="http://host'" target="_blank">http://host'</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host"', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '"']);
      assert.deepStrictEqual(inspect(parser, input(' http://host`', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '`']);
      assert.deepStrictEqual(inspect(parser, input(' http://host|', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '|']);
      assert.deepStrictEqual(inspect(parser, input(' http://host&', new Context())), [['<a class="url" href="http://host&amp;" target="_blank">http://host&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host$', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '$']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#"$"', new Context())), [['<a class="url" href="http://host#" target="_blank">http://host#</a>'], '"$"']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#($)', new Context())), [['<a class="url" href="http://host#" target="_blank">http://host#</a>'], '($)']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#(($))', new Context())), [['<a class="url" href="http://host#" target="_blank">http://host#</a>'], '(($))']);
      assert.deepStrictEqual(inspect(parser, input(' http://user@host', new Context())), [['<a class="url" href="http://user@host" target="_blank">http://user@host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host#@', new Context())), [['<a class="url" href="http://host#@" target="_blank">http://host#@</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' http://host[', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '[']);
      assert.deepStrictEqual(inspect(parser, input(' http://host]', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ']']);
      assert.deepStrictEqual(inspect(parser, input(' http://host(', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '(']);
      assert.deepStrictEqual(inspect(parser, input(' http://host)', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], ')']);
      assert.deepStrictEqual(inspect(parser, input(' http://host{', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '{']);
      assert.deepStrictEqual(inspect(parser, input(' http://host}', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '}']);
      assert.deepStrictEqual(inspect(parser, input(' http://host<', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '<']);
      assert.deepStrictEqual(inspect(parser, input(' http://host>', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '>']);
      assert.deepStrictEqual(inspect(parser, input(' http://host（', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '（']);
      assert.deepStrictEqual(inspect(parser, input(' http://host）', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '）']);
    });

    it('trailing entities', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://host?&hl;', new Context())), [['<a class="url" href="http://host?&amp;hl" target="_blank">http://host?&amp;hl</a>'], ';']);
      assert.deepStrictEqual(inspect(parser, input(' http://host?&hl;&hl;', new Context())), [['<a class="url" href="http://host?&amp;hl;&amp;hl" target="_blank">http://host?&amp;hl;&amp;hl</a>'], ';']);
    });

    it('protocol', () => {
      assert.deepStrictEqual(inspect(parser, input(' http://host', new Context())), [['<a class="url" href="http://host" target="_blank">http://host</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' https://host', new Context())), [['<a class="url" href="https://host" target="_blank">https://host</a>'], '']);
    });

  });

});
