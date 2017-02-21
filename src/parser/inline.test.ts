import { loop } from '../combinator/loop';
import { inline } from './inline';
import { inspect } from './debug.test';

describe('Unit: parser/inline', () => {
  describe('inline', () => {
    const parser = loop(inline);

    it('empty', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('a`b`<s>')), [['a', '<code>b</code>', '&lt;', 's', '&gt;'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~<var>`a`</var>~~')), [['<s><var><code>a</code></var></s>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>~~<dfn>a</dfn>~~</var>')), [['<var><s><dfn>a</dfn></s></var>'], '']);
    });

    it('flip', () => {
      assert.deepStrictEqual(inspect(parser('**~~*<a>*~~**')), [['<strong><s><em>&lt;a&gt;</em></s></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*~~**<a>**~~*')), [['<em><s><strong>&lt;a&gt;</strong></s></em>'], '']);
    });

  });

});
