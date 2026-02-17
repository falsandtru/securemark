import { Parser, input } from '../parser';
import { subsequence } from './subsequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/subsequence', () => {
  describe('subsequence', () => {
    const a: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'a'
        ? void ++context.position || [['A']]
        : undefined;
    };
    const b: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'b'
        ? void ++context.position || [['B']]
        : undefined;
    };
    const c: Parser<string> = ({ context }) => {
      return context.source[context.position] === 'c'
        ? void ++context.position || [['C']]
        : undefined;
    };
    const abc = subsequence<Parser<string, {}, [typeof a, typeof b, typeof c]>>([a, b, c]);
    const { context: ctx } = input('', {});

    it('basic', () => {
      const parser = abc;
      assert.deepStrictEqual(inspect(parser(input('', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', ctx)), ctx), [['A'], '']);
      assert.deepStrictEqual(inspect(parser(input('b', ctx)), ctx), [['B'], '']);
      assert.deepStrictEqual(inspect(parser(input('c', ctx)), ctx), [['C'], '']);
      assert.deepStrictEqual(inspect(parser(input('ab', ctx)), ctx), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ba', ctx)), ctx), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser(input('aab', ctx)), ctx), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser(input('abb', ctx)), ctx), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser(input('bba', ctx)), ctx), [['B'], 'ba']);
      assert.deepStrictEqual(inspect(parser(input('ac', ctx)), ctx), [['A', 'C'], '']);
      assert.deepStrictEqual(inspect(parser(input('bc', ctx)), ctx), [['B', 'C'], '']);
    });

  });

});
