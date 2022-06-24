import { Parser } from '../parser';
import { subsequence } from './subsequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/subsequence', () => {
  describe('subsequence', () => {
    const a: Parser<string, never> = source => {
      return source && source[0] === 'a'
        ? [['A'], source.slice(1)]
        : undefined;
    };
    const b: Parser<string, never> = source => {
      return source && source[0] === 'b'
        ? [['B'], source.slice(1)]
        : undefined;
    };
    const c: Parser<string, never> = source => {
      return source && source[0] === 'c'
        ? [['C'], source.slice(1)]
        : undefined;
    };
    const abc = subsequence<Parser<string, {}, [typeof a, typeof b, typeof c]>>([a, b, c]);

    it('basic', () => {
      const parser = abc;
      assert.deepStrictEqual(inspect(parser('', {})), undefined);
      assert.deepStrictEqual(inspect(parser('a', {})), [['A'], '']);
      assert.deepStrictEqual(inspect(parser('b', {})), [['B'], '']);
      assert.deepStrictEqual(inspect(parser('c', {})), [['C'], '']);
      assert.deepStrictEqual(inspect(parser('ab', {})), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser('ba', {})), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser('aab', {})), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser('abb', {})), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser('bba', {})), [['B'], 'ba']);
      assert.deepStrictEqual(inspect(parser('ac', {})), [['A', 'C'], '']);
      assert.deepStrictEqual(inspect(parser('bc', {})), [['B', 'C'], '']);
    });

  });

});
