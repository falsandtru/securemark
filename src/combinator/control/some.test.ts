import { Parser, Result, Input, Node, input } from '../parser';
import { union } from './union';
import { some } from './some';
import { inspect } from '../../debug.test';

describe('Unit: lib/parser/control/some', () => {
  describe('some', () => {
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
      const parser = some(AB, /AAA/y);
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('A')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('B')), [['b'], '']);
      assert.deepStrictEqual(inspect(parser, input('AB')), [['a', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('BA')), [['b', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('AAB')), [['a', 'a', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('BBA')), [['b', 'b', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('AAA')), undefined);
      assert.deepStrictEqual(inspect(parser, input('BBB')), [['b', 'b', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('AAAB')), undefined);
      assert.deepStrictEqual(inspect(parser, input('BAAA')), [['b'], 'AAA']);
    });

  });

});
