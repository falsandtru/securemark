import { aside } from './aside';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/aside', () => {
  describe('aside', () => {
    const parser = (source: string) => some(aside)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~aside\n~~~')), [['<pre class="invalid" translate="no">~~~aside\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside\n# \n~~~')), [['<pre class="invalid" translate="no">~~~aside\n# \n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside a\n# 0\n~~~')), [['<pre class="invalid" translate="no">~~~aside a\n# 0\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~aside\n# 0${'\n'.repeat(301)}~~~`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~aside\n# 0\n~~~')), [['<aside id="index:0" class="aside"><h1>0</h1><ol class="references"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside\n## 0\n~~~')), [['<aside id="index:0" class="aside"><h2>0</h2><ol class="references"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside\n# 0\n\n$-0.0\n\n## 1\n\n$test-a\n> \n~~~')), [['<aside id="index:0" class="aside"><h1>0</h1><figure data-label="$-0.0" data-group="$" hidden="" data-number="0.0"></figure><h2>1</h2><figure data-type="quote" data-label="test-a" data-group="test" data-number="1.1"><figcaption><span class="figindex">Test 1.1. </span></figcaption><div><blockquote></blockquote></div></figure><ol class="references"></ol></aside>'], '']);
    });

  });

});
