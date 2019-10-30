import { block } from './block';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(block(_ => [[], '\n', {}])(' \n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(_ => [[], '', {}])('\n')), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], '', {}])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], '', {}])('\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], '\n', {}])('\n\n')), [[], '\n']);
    });

  });

});
