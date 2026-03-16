import { aside } from './aside';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/aside', () => {
  describe('aside', () => {
    const parser = some(aside);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~aside\n~~~', new Context())), [['<pre class="invalid" translate="no">~~~aside\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~aside\n# \n~~~', new Context())), [['<pre class="invalid" translate="no">~~~aside\n# \n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~aside a\n# 0\n~~~', new Context())), [['<pre class="invalid" translate="no">~~~aside a\n# 0\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`~~~aside\n# 0${'\n'.repeat(301)}~~~`, new Context()), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~aside\n# 0\n~~~', new Context())), [['<aside id="index::0" class="aside"><h1 id="index:random:0" class="local">0</h1><h2>References</h2><ol class="references"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~aside\n## 0\n~~~', new Context())), [['<aside id="index::0" class="aside"><h2 id="index:random:0" class="local">0</h2><h2>References</h2><ol class="references"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~aside\n# 0\n\n$-0.0\n\n## 1\n\n$test-a\n> \n~~~', new Context())), [['<aside id="index::0" class="aside"><h1 id="index:random:0" class="local">0</h1><figure data-label="$-0.0" data-group="$" hidden="" data-number="0.0"></figure><h2 id="index:random:1" class="local">1</h2><figure data-type="quote" data-label="test-a" data-group="test" data-number="1.1" id="label:random:test-a"><figcaption><span class="figindex">Test 1.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><h2>References</h2><ol class="references"></ol></aside>'], '']);
    });

  });

});
