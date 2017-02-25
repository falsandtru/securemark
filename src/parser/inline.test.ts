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
      assert.deepStrictEqual(inspect(parser('~~<ruby>`a`</ruby>~~')), [['<del><ruby><code>a</code></ruby></del>'], '']);
      assert.deepStrictEqual(inspect(parser('<ruby>~~<mark>a</mark>~~</ruby>')), [['<ruby><del><mark>a</mark></del></ruby>'], '']);
    });

    it('flip', () => {
      assert.deepStrictEqual(inspect(parser('**~~*<a>*~~**')), [['<strong><del><em>&lt;a&gt;</em></del></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('*~~**<a>**~~*')), [['<em><del><strong>&lt;a&gt;</strong></del></em>'], '']);
    });

  });

});
