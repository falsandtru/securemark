import { Parser, Result } from '../parser';
import { union } from './union';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/union', () => {
  describe('union', () => {
    const a: Parser<string, never, object, object> = (source, config): Result<string, never, object, object> => {
      return source && source[0] === 'a'
        ? [['A'], source.slice(1), config]
        : undefined;
    }
    const b: Parser<string, never, object, object> = (source, config): Result<string, never, object, object> => {
      return source && source[0] === 'b'
        ? [['B'], source.slice(1), config]
        : undefined;
    }
    const ab = union<Parser<string, [typeof a, typeof b], object, object>>([a, b]);

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser('', {})), undefined);
      assert.deepStrictEqual(inspect(parser('a', {})), [['A'], '']);
      assert.deepStrictEqual(inspect(parser('b', {})), [['B'], '']);
      assert.deepStrictEqual(inspect(parser('ab', {})), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser('ba', {})), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser('aab', {})), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser('abb', {})), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser('bba', {})), [['B'], 'ba']);
    });

  });

});
