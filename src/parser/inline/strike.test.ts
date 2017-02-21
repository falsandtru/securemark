import { loop } from '../../combinator/loop';
import { strike } from './strike';
import { inspect } from '../debug.test';

describe('Unit: parser/strike', () => {
  describe('strike', () => {
    it('invalid', () => {
      const parser = loop(strike);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~~a~~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~<u>~~')), void 0);
      assert.deepStrictEqual(inspect(parser('a~~a~~')), void 0);
    });

    it('ab', () => {
      const parser = loop(strike);
      assert.deepStrictEqual(inspect(parser('~~a~~')), [['<s>a</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ab~~')), [['<s>ab</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\nb~~')), [['<s>ab</s>'], '']);
    });

    it('nest', () => {
      const parser = loop(strike);
      assert.deepStrictEqual(inspect(parser('~~<a>~~')), [['<s>&lt;a&gt;</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\<a>~~')), [['<s>&lt;a&gt;</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~\\<u>~~')), [['<s>&lt;u&gt;</s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~<u></u>~~')), [['<s><u></u></s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~`<u>`~~')), [['<s><code>&lt;u&gt;</code></s>'], '']);
      assert.deepStrictEqual(inspect(parser('~~[](#)~~')), [['<s><a href="#">#</a></s>'], '']);
    });

    it('triple', () => {
      const parser = loop(strike);
      assert.deepStrictEqual(inspect(parser('~~~a~~~')), [['<s><sub>a</sub></s>'], '']);
    });

  });

});
