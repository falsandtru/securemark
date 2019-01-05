import { line, subline } from './line';
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

  describe('subline', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])('')), undefined);
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])('\n')), undefined);
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])(' \n')), undefined);
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])('\n\n')), undefined);
      assert.deepStrictEqual(inspect(subline(_ => [[], '\n'])('\n\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])(' ')), [[], '']);
      assert.deepStrictEqual(inspect(subline(_ => [[], '\n'])(' \n')), [[], '\n']);
    });

  });

});
