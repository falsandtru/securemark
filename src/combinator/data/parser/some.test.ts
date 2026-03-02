import { Parser, List, Data, Ctx, input } from '../parser';
import { union } from './union';
import { some } from './some';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/some', () => {
  describe('some', () => {
    const a: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'a'
        ? void ++context.position || new List([new Data('A')])
        : undefined;
    };
    const b: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'b'
        ? void ++context.position || new List([new Data('B')])
        : undefined;
    };
    const ab = union<Parser<string, Ctx, [typeof a, typeof b]>>([a, b]);
    const { context: ctx } = input('', {});

    it('basic', () => {
      const parser = some(ab, /aaa/y);
      assert.deepStrictEqual(inspect(parser(input('', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', ctx)), ctx), [['A'], '']);
      assert.deepStrictEqual(inspect(parser(input('b', ctx)), ctx), [['B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ab', ctx)), ctx), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ba', ctx)), ctx), [['B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser(input('aab', ctx)), ctx), [['A', 'A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('bba', ctx)), ctx), [['B', 'B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser(input('aaa', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('bbb', ctx)), ctx), [['B', 'B', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('aaab', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('baaa', ctx)), ctx), [['B'], 'aaa']);
    });

  });

});
