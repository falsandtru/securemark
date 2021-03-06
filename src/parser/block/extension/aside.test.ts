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
      assert.deepStrictEqual(inspect(parser(`~~~aside\n# 0${'\n'.repeat(301)}~~~`), '>'), [['<pre class="notranslate invalid">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~aside\n# 0\n~~~')), [['<aside id="index:0" class="aside"><h1>0</h1><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside\n## 0\n~~~')), [['<aside id="index:0" class="aside"><h2>0</h2><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~aside\n# 0\n\n$-0.0\n\n## 1\n\n$fig-a\n> \n~~~')), [['<aside id="index:0" class="aside"><h1>0</h1><figure data-label="$-0.0" data-group="$" style="display: none;" data-number="0.0"></figure><h2>1</h2><figure data-label="fig-a" data-group="fig" data-number="1.1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig 1.1. </span><figcaption></figcaption></figure><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
    });

  });

});
