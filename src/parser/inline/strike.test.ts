import { loop } from '../../combinator/loop';
import { strike } from './strike';
import { inspect } from '../debug.test';

describe('Unit: parser/strike', () => {
  describe('strike', () => {
    const parser = loop(strike);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~~a~~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('a~~a~~')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('~~a~~')), [['<s>a</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ab~~')), [['<s>ab</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\nb~~')), [['<s>ab</s>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~<a>~~')), [['<s>&lt;a&gt;</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<var>~~')), [['<s>&lt;var&gt;</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<var></var>~~')), [['<s><var></var></s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~`<var>`~~')), [['<s><code>&lt;var&gt;</code></s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~[](#)~~')), [['<s><a href="#">#</a></s>'], '']);
    });

    it('triple', () => {
      assert.deepStrictEqual(inspect(parser('~~~a~~~')), [['<s><sub>a</sub></s>'], '']);
    });

  });

});
