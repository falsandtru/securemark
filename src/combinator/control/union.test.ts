import { Parser, Result, Input, Node, input } from '../parser';
import { union } from './union';
import { inspect } from '../../debug.test';

describe('Unit: lib/parser/control/union', () => {
  describe('union', () => {
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
    const AB = union<Parser<string, Input, [typeof A, typeof B]>>([A, B]);

    it('basic', () => {
      const parser = AB;
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('A')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('B')), [['b'], '']);
      assert.deepStrictEqual(inspect(parser, input('AB')), [['a'], 'B']);
      assert.deepStrictEqual(inspect(parser, input('BA')), [['b'], 'A']);
      assert.deepStrictEqual(inspect(parser, input('AAB')), [['a'], 'AB']);
      assert.deepStrictEqual(inspect(parser, input('ABB')), [['a'], 'BB']);
      assert.deepStrictEqual(inspect(parser, input('BBA')), [['b'], 'BA']);
    });

  });

});
