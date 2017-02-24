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
      assert.deepStrictEqual(inspect(parser('a`b`<q>')), [['a', '<code>b</code>', '&lt;', 'q', '&gt;'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~<var>`a`</var>~~')), [['<del><var><code>a</code></var></del>'], '']);
      assert.deepStrictEqual(inspect(parser('<var>~~<dfn>a</dfn>~~</var>')), [['<var><del><dfn>a</dfn></del></var>'], '']);
    });

    it('flip', () => {
      assert.deepStrictEqual(inspect(parser('**~~*<a>*~~**')), [['<strong><del><em>&lt;a&gt;</em></del></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*~~**<a>**~~*')), [['<em><del><strong>&lt;a&gt;</strong></del></em>'], '']);
    });

  });

});
