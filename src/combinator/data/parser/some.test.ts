import { Parser, List, Node, Context, input } from '../parser';
import { union } from './union';
import { some } from './some';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/some', () => {
  describe('some', () => {
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
      const parser = some(ab, /aaa/y);
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [['A'], '']);
      assert.deepStrictEqual(inspect(parser, input('b', new Context())), [['B'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser, input('ba', new Context())), [['B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser, input('aab', new Context())), [['A', 'A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser, input('bba', new Context())), [['B', 'B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser, input('aaa', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('bbb', new Context())), [['B', 'B', 'B'], '']);
      assert.deepStrictEqual(inspect(parser, input('aaab', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('baaa', new Context())), [['B'], 'aaa']);
    });

  });

});
