import { loop } from '../../combinator/loop';
import { quote } from './quote';
import { inspect } from '../debug.test';

describe('Unit: parser/quote', () => {
  describe('quote', () => {
    const parser = loop(quote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('"')), void 0);
      assert.deepStrictEqual(inspect(parser('""')), void 0);
      assert.deepStrictEqual(inspect(parser('" "')), void 0);
      assert.deepStrictEqual(inspect(parser('" a"')), void 0);
      assert.deepStrictEqual(inspect(parser('"a "')), void 0);
      assert.deepStrictEqual(inspect(parser('" a "')), void 0);
      assert.deepStrictEqual(inspect(parser('"\n"')), void 0);
      assert.deepStrictEqual(inspect(parser('""a""')), void 0);
      assert.deepStrictEqual(inspect(parser('a"a"')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('"a"')), [['<q>a</q>'], '']);
      assert.deepStrictEqual(inspect(parser('"ab"')), [['<q>ab</q>'], '']);
      assert.deepStrictEqual(inspect(parser('"a\nb"')), [['<q>ab</q>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('"*a*"')), [['<q><em>a</em></q>'], '']);
      assert.deepStrictEqual(inspect(parser('"<wbr>"')), [['<q><wbr></q>'], '']);
    });

  });

});
