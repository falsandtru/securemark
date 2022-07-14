import { trim } from './trim';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/trim', () => {
  describe('trim', () => {
    it('', () => {
      const parser = trim(({ source }) => [[source], '']);
      assert.deepStrictEqual(inspect(parser({ source: '', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'a', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'a\n', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'a ', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'a \n', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a ', context: {} })), [['a'], '']);
      assert.deepStrictEqual(inspect(parser({ source: ' a \n b \n', context: {} })), [['a \n b'], '']);
    });

  });

});
