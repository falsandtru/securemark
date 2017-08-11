import { loop } from '../../combinator/loop';
import { symbol } from './symbol';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/symbol', () => {
  describe('symbol', () => {
    const parser = loop(symbol);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), void 0);
      assert.deepStrictEqual(inspect(parser('[a]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:]')), void 0);
      assert.deepStrictEqual(inspect(parser('[: a]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:a ]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:a\nb]')), void 0);
    });

    it('ab', () => {
      assert(parser('[:a]'));
      assert(parser('[:a b]'));
      assert(parser('[:\\]]'));
      assert(parser('[*a]'));
    });

  });

});
