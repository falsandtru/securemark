import { graph } from './graph';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/graph', () => {
  describe('graph', () => {
    const parser = some(graph);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~graph/sequence\na\n~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~graph/sequence\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~graph/sequence\na\n~~~')), undefined);
      assert(!parser('~~~graph/sequence\n' + '\n'.repeat(100) + '~~~'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~graph/sequence\n~~~')), [['<pre class="sequence graph notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~graph/sequence\na\n~~~')), [['<pre class="sequence graph notranslate">a</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~graph/flowchart\n~~~')), [['<pre class="flowchart graph notranslate"></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~graph/graphviz\n~~~')), [['<pre class="graphviz graph notranslate" data-engine=""></pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~graph/graphviz dot\n~~~')), [['<pre class="graphviz graph notranslate" data-engine="dot"></pre>'], '']);
      assert(parser('~~~graph/sequence\n' + '\n'.repeat(99) + '~~~'));
    });

  });

});
