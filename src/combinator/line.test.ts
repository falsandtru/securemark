import { line, subline } from './line';
import { inspect } from '../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'], false)(' \n')), undefined);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n\n')), undefined);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])('\n\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])('\n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n\n'])('\n\n\n')), [[], '\n\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''], true)(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'], true)(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ' \n'], true)(' \n')), [[], '']);
    });

  });

  describe('subline', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])(' \n')), undefined);
      assert.deepStrictEqual(inspect(subline(_ => [[], ''])('\n\n')), undefined);
      assert.deepStrictEqual(inspect(subline(_ => [[], '\n'])('\n\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(subline(_ => [[], '\n'])(' \n')), [[], '\n']);
    });

  });

});
