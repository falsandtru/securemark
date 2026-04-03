import { block } from './block';
import { input } from '../parser';
import { inspect } from '../../debug.test';

describe('Unit: lib/parser/combinator/block', () => {
  describe('block', () => {
    it('invalid', () => {
      assert.throws(() => inspect(block(() => []), (input(' \n'))));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(input => { input.position = input.source.length; return []; }), input('\n')), [[], '']);
      assert.deepStrictEqual(inspect(block(input => { input.position = input.source.length; return []; }), input(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(block(input => { input.position = input.source.length; return []; }), input('\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(block(input => { input.position = input.source.length - 1; return []; }), input('\n\n')), [[], '\n']);
    });

  });

});
