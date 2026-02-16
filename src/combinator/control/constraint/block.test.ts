import { block } from './block';
import { input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    it('invalid', () => {
      assert.throws(() => block(_ => [[], '\n'])(input(' \n', {})));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(_ => [[], '',])(input('\n', {}))), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], ''])(input(' \n', {}))), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], ''])(input('\n\n', {}))), [[], '']);
      assert.deepStrictEqual(inspect(block(_ => [[], '\n'])(input('\n\n', {}))), [[], '\n']);
    });

  });

});
