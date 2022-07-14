import { line } from './line';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])({ source: '', context: {} })), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])({ source: ' ', context: {} })), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])({ source: '\n', context: {} })), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])({ source: '\n\n', context: {} })), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])({ source: ' \n', context: {} })), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])({ source: ' \n', context: {} })), [[], '']);
    });

  });

});
