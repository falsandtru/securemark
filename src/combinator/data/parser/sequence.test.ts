import { Parser, List, Node, Context, input } from '../parser';
import { sequence } from './sequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/sequence', () => {
  describe('sequence', () => {
    const a: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'a'
        ? void ++context.position || new List([new Node('A')])
        : undefined;
    };
    const b: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'b'
        ? void ++context.position || new List([new Node('B')])
        : undefined;
    };
    const ab = sequence<Parser<string, Context, [typeof a, typeof b]>>([a, b]);

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser, input('ba', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('aab', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('abb', new Context())), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('bba', new Context())), undefined);
    });

  });

});
