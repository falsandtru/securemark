import { Parser, Result, Input, Node, input } from '../parser';
import { subsequence } from './subsequence';
import { inspect } from '../../debug.test';

describe('Unit: lib/parser/control/subsequence', () => {
  describe('subsequence', () => {
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
    const C: Parser<string> = (input, output) => {
      if(input.source[input.position] === 'C'){
        ++input.position;
        output.append(new Node('c'));
        return Result.succ;
      }
    };
    const ABC = subsequence<Parser<string, Input, [typeof A, typeof B, typeof C]>>([A, B, C]);

    it('basic', () => {
      const parser = ABC;
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('A')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('B')), [['b'], '']);
      assert.deepStrictEqual(inspect(parser, input('C')), [['c'], '']);
      assert.deepStrictEqual(inspect(parser, input('AB')), [['a', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('BA')), [['b'], 'A']);
      assert.deepStrictEqual(inspect(parser, input('AAB')), [['a'], 'AB']);
      assert.deepStrictEqual(inspect(parser, input('ABB')), [['a', 'b'], 'B']);
      assert.deepStrictEqual(inspect(parser, input('BBA')), [['b'], 'BA']);
      assert.deepStrictEqual(inspect(parser, input('AC')), [['a', 'c'], '']);
      assert.deepStrictEqual(inspect(parser, input('BC')), [['b', 'c'], '']);
    });

  });

});
