import { block } from './block';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    it('invalid', () => {
      assert.throws(() => block(_ => [[], '\n'])({ source: ' \n', context: {} }));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(_ => [[], ''])({ source: '\n', context: {} })), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], ''])({ source: ' \n', context: {} })), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], ''])({ source: '\n\n', context: {} })), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], '\n'])({ source: '\n\n', context: {} })), [[], '\n']);
    });

  });

});
