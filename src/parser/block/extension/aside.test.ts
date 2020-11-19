import { aside } from './aside';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/aside', () => {
  describe('aside', () => {
    const parser = (source: string) => some(aside)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~aside\n~~~')), [['<pre class="notranslate invalid">~~~aside\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside\n# \n~~~')), [['<pre class="notranslate invalid">~~~aside\n# \n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside a\n# 0\n~~~')), [['<pre class="notranslate invalid">~~~aside a\n# 0\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~aside\n# 0${'\n'.repeat(1001)}~~~`), '>'), [['<pre class="notranslate invalid">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~aside\n# 0\n~~~')), [['<aside id="index:0" class="aside"><h1>0</h1><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
    });

  });

});
