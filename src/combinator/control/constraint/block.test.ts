import { block } from './block';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    it('invalid', () => {
      assert.throws(() => block(_ => [[], '\n'])(' \n'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(_ => [[], ''])('\n')), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], ''])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], ''])('\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], '\n'])('\n\n')), [[], '\n']);
    });

  });

});
