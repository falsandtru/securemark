import { line } from './line';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('')), undefined);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'], false)(' \n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(' ')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''], false)(' ')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''], false)('\n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''], false)(' \n')), [[], '']);
    });

  });

});
