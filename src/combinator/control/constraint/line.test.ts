import { line } from './line';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(' ')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])(' \n')), [[], '']);
    });

  });

});
