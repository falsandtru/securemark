import { Parser, Result, Input, Node, input } from '../parser';
import { sequence } from './sequence';
import { backtrack } from '../effect/backtrack';
import { inspect } from '../../debug.test';

describe('Unit: lib/parser/control/sequence', () => {
  describe('sequence', () => {
    const A: Parser<string> = (input, output) => {
      if(input.source[input.position] === 'A'){
        ++input.position;
        output.append(new Node('a'));
        return Result.succ;
      }
    };
    const B: Parser<string> = (input, output) => {
      if(input.source[input.position] === 'B'){
        ++input.position;
        output.append(new Node('b'));
        return Result.succ;
      }
    };
    const AB = backtrack(sequence<Parser<string, Input, [typeof A, typeof B]>>([A, B]));

    it('basic', () => {
      const parser = AB;
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('A')), undefined);
      assert.deepStrictEqual(inspect(parser, input('B')), undefined);
      assert.deepStrictEqual(inspect(parser, input('AB')), [['a', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('BA')), undefined);
      assert.deepStrictEqual(inspect(parser, input('AAB')), undefined);
      assert.deepStrictEqual(inspect(parser, input('ABB')), [['a', 'b'], 'B']);
      assert.deepStrictEqual(inspect(parser, input('BBA')), undefined);
    });

  });

});
