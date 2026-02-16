import { input } from '../../data/parser';
import { line } from './line';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(input('', {}))), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(input(' ', {}))), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(input('\n', {}))), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(input('\n\n', {}))), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(input(' \n', {}))), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])(input(' \n', {}))), [[], '']);
    });

  });

});
