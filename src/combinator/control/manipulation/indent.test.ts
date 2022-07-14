import { indent } from './indent';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/indent', () => {
  describe('indent', () => {
    it('valid', () => {
      const parser = indent(({ source }) => [[source], '']);
      assert.deepStrictEqual(inspect(parser({ source: '', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: ' ', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: '  ', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'a ', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: ' a\n', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a ', context: {} })), [['a '], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a \n', context: {} })), [['a '], '']);
      assert.deepStrictEqual(inspect(parser({ source: '  a', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a\n a', context: {} })), [['a\na'], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a\n  a', context: {} })), [['a\n a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: '  a\n a', context: {} })), [['a'], ' a']);
      assert.deepStrictEqual(inspect(parser({ source: ' \ta', context: {} })), [['\ta'], '']);
      assert.deepStrictEqual(inspect(parser({ source: '\ta', context: {} })), [['a'], '']);
    });

  });

});
