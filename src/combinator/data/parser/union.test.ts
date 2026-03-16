import { Parser, List, Node, Context, input } from '../parser';
import { union } from './union';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/union', () => {
  describe('union', () => {
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
    const ab = union<Parser<string, Context, [typeof a, typeof b]>>([a, b]);

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [['A'], '']);
      assert.deepStrictEqual(inspect(parser, input('b', new Context())), [['B'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser, input('ba', new Context())), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser, input('aab', new Context())), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser, input('abb', new Context())), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser, input('bba', new Context())), [['B'], 'ba']);
    });

  });

});
