import { loop } from '../../../combinator/loop';
import { placeholder } from './placeholder';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = loop(placeholder);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), void 0);
      assert.deepStrictEqual(inspect(parser('[a]')), void 0);
      assert.deepStrictEqual(inspect(parser('[ab]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:]')), void 0);
      assert.deepStrictEqual(inspect(parser('[: a]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:a ]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:a\nb]')), void 0);
      assert.deepStrictEqual(inspect(parser('[][]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:]]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:][]')), void 0);
      assert.deepStrictEqual(inspect(parser('[:][:]')), void 0);
    });

    it('ab', () => {
      assert(parser('[:a]'));
      assert(parser('[:a b]'));
      assert(parser('[:\\]]'));
      assert(parser('[:`a`]'));
    });

  });

});
