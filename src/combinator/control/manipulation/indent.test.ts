import { indent } from './indent';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/indent', () => {
  describe('indent', () => {
    it('valid', () => {
      const parser = indent((s, _) => [[s], '']);
      assert.deepStrictEqual(inspect(parser('', {})), undefined);
      assert.deepStrictEqual(inspect(parser(' ', {})), undefined);
      assert.deepStrictEqual(inspect(parser('  ', {})), undefined);
      assert.deepStrictEqual(inspect(parser('a ', {})), undefined);
      assert.deepStrictEqual(inspect(parser(' a\n', {})), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a ', {})), [['a '], '']);
      assert.deepStrictEqual(inspect(parser(' a \n', {})), [['a '], '']);
      assert.deepStrictEqual(inspect(parser('  a', {})), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a\n a', {})), [['a\na'], '']);
      assert.deepStrictEqual(inspect(parser(' a\n  a', {})), [['a\n a'], '']);
      assert.deepStrictEqual(inspect(parser('  a\n a', {})), [['a'], ' a']);
      assert.deepStrictEqual(inspect(parser(' \ta', {})), [['\ta'], '']);
      assert.deepStrictEqual(inspect(parser('\ta', {})), [['a'], '']);
    });

  });

});
