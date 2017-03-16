import { loop } from '../../combinator/loop';
import { deletion } from './deletion';
import { inspect } from '../debug.test';

describe('Unit: parser/deletion', () => {
  describe('deletion', () => {
    const parser = loop(deletion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~ ~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~\n~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~<wbr>~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~~a~~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('a~~a~~')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('~~a~~')), [['<del>a</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~ab~~')), [['<del>ab</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~a\nb~~')), [['<del>a b</del>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('~~<a>~~')), [['<del>&lt;a&gt;</del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~`<wbr>`~~')), [['<del><code>&lt;wbr&gt;</code></del>'], '']);
      assert.deepStrictEqual(inspect(parser('~~[](#)~~')), [['<del><a href="#">#</a></del>'], '']);
    });

    it('triple', () => {
      assert.deepStrictEqual(inspect(parser('~~~a~~~')), [['<del><sub>a</sub></del>'], '']);
    });

  });

});
