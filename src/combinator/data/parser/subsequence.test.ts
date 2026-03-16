import { Parser, List, Node, Context, input } from '../parser';
import { subsequence } from './subsequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/subsequence', () => {
  describe('subsequence', () => {
    const a: Parser<string> = context => {
      return context.source[context.position] === 'a'
        ? void ++context.position || new List([new Node('A')])
        : undefined;
    };
    const b: Parser<string> = context => {
      return context.source[context.position] === 'b'
        ? void ++context.position || new List([new Node('B')])
        : undefined;
    };
    const c: Parser<string> = context => {
      return context.source[context.position] === 'c'
        ? void ++context.position || new List([new Node('C')])
        : undefined;
    };
    const abc = subsequence<Parser<string, Context, [typeof a, typeof b, typeof c]>>([a, b, c]);

    it('basic', () => {
      const parser = abc;
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [['A'], '']);
      assert.deepStrictEqual(inspect(parser, input('b', new Context())), [['B'], '']);
      assert.deepStrictEqual(inspect(parser, input('c', new Context())), [['C'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser, input('ba', new Context())), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser, input('aab', new Context())), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser, input('abb', new Context())), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('bba', new Context())), [['B'], 'ba']);
      assert.deepStrictEqual(inspect(parser, input('ac', new Context())), [['A', 'C'], '']);
      assert.deepStrictEqual(inspect(parser, input('bc', new Context())), [['B', 'C'], '']);
    });

  });

});
