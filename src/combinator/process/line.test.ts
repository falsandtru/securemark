import { input } from '../parser';
import { line } from './line';
import { inspect } from '../../debug.test';

describe('Unit: lib/parser/combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(() => []), input('')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(input => { input.position = input.source.length; return []; }), input(' ')), [[], '']);
      assert.deepStrictEqual(inspect(line(input => { input.position = input.source.length; return []; }), input('\n')), [[], '']);
      assert.deepStrictEqual(inspect(line(input => { input.position = input.source.length; return []; }), input('\n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(line(input => { input.position = input.source.length; return []; }), input(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(input => { input.position = input.source.length - 1; return []; }), input(' \n')), [[], '']);
    });

  });

});
