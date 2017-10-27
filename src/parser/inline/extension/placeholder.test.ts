import { loop } from '../../../combinator/loop';
import { placeholder } from './placeholder';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = loop(placeholder);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[ab]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:]')), undefined);
      assert.deepStrictEqual(inspect(parser('[: a]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:a ]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:a\nb]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:a\\\nb]')), undefined);
      assert.deepStrictEqual(inspect(parser('[][]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:][]')), undefined);
      assert.deepStrictEqual(inspect(parser('[:][:]')), undefined);
    });

    it('ab', () => {
      assert(parser('[:a]'));
      assert(parser('[:a b]'));
      assert(parser('[:\\]]'));
      assert(parser('[:`a`]'));
    });

  });

});
