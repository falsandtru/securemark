import { Parser, Result } from '../parser';
import { union } from './union';
import { some } from './some';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/some', () => {
  describe('some', () => {
    const a: Parser<string, never, object> = (source, config): Result<string, never, object> => {
      return source && source[0] === 'a'
        ? [['A'], source.slice(1), config]
        : undefined;
    }
    const b: Parser<string, never, object> = (source, config): Result<string, never, object> => {
      return source && source[0] === 'b'
        ? [['B'], source.slice(1), config]
        : undefined;
    }
    const ab = union<Parser<string, [typeof a, typeof b], object>>([a, b]);

    it('basic', () => {
      const parser = some(ab, /^aaa/);
      assert.deepStrictEqual(inspect(parser('', {})), undefined);
      assert.deepStrictEqual(inspect(parser('a', {})), [['A'], '']);
      assert.deepStrictEqual(inspect(parser('b', {})), [['B'], '']);
      assert.deepStrictEqual(inspect(parser('ab', {})), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser('ba', {})), [['B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser('aab', {})), [['A', 'A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser('bba', {})), [['B', 'B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser('aaa', {})), undefined);
      assert.deepStrictEqual(inspect(parser('bbb', {})), [['B', 'B', 'B'], '']);
      assert.deepStrictEqual(inspect(parser('aaab', {})), undefined);
      assert.deepStrictEqual(inspect(parser('baaa', {})), [['B'], 'aaa']);
    });

  });

});
