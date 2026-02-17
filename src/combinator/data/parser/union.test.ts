import { Parser, input } from '../parser';
import { union } from './union';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/union', () => {
  describe('union', () => {
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
    const ab = union<Parser<string, {}, [typeof a, typeof b]>>([a, b]);
    const { context: ctx } = input('', {});

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser(input('', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', ctx)), ctx), [['A'], '']);
      assert.deepStrictEqual(inspect(parser(input('b', ctx)), ctx), [['B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ab', ctx)), ctx), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser(input('ba', ctx)), ctx), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser(input('aab', ctx)), ctx), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser(input('abb', ctx)), ctx), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser(input('bba', ctx)), ctx), [['B'], 'ba']);
    });

  });

});
