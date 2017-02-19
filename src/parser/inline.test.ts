import { loop } from '../combinator/loop';
import { inline } from './inline';
import { inspect } from './debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    it('empty', () => {
      const parser = loop(inline);
      assert.deepStrictEqual(inspect(parser('')), void 0);
    });

    it('ab', () => {
      const parser = loop(inline);
      assert.deepStrictEqual(inspect(parser('a`b`<s>')), [['a', '<code>b</code>', '&lt;', 's', '&gt;'], '']);
    });

    it('nest', () => {
      const parser = loop(inline);
      assert.deepStrictEqual(inspect(parser('~~<u>`a`</u>~~')), [['<s><u><code>a</code></u></s>'], '']);
      assert.deepStrictEqual(inspect(parser('<u>~~<q>a</q>~~</u>')), [['<u><s><q>a</q></s></u>'], '']);
    });

    it('flip', () => {
      const parser = loop(inline);
      assert.deepStrictEqual(inspect(parser('**~~*<a>*~~**')), [['<strong><s><em>&lt;a&gt;</em></s></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*~~**<a>**~~*')), [['<em><s><strong>&lt;a&gt;</strong></s></em>'], '']);
    });

  });

});
