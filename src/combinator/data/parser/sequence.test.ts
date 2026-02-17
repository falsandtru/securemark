import { Parser, input } from '../parser';
import { sequence } from './sequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/sequence', () => {
  describe('sequence', () => {
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
    const ab = sequence<Parser<string, {}, [typeof a, typeof b]>>([a, b]);
    const { context: ctx } = input('', {});

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser(input('', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('b', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('ab', ctx)), ctx), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ba', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('aab', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('abb', ctx)), ctx), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser(input('bba', ctx)), ctx), undefined);
    });

  });

});
