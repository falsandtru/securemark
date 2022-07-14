import { Parser } from '../parser';
import { subsequence } from './subsequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/subsequence', () => {
  describe('subsequence', () => {
    const a: Parser<string, never> = ({ source }) => {
      return source && source[0] === 'a'
        ? [['A'], source.slice(1)]
        : undefined;
    };
    const b: Parser<string, never> = ({ source }) => {
      return source && source[0] === 'b'
        ? [['B'], source.slice(1)]
        : undefined;
    };
    const c: Parser<string, never> = ({ source }) => {
      return source && source[0] === 'c'
        ? [['C'], source.slice(1)]
        : undefined;
    };
    const abc = subsequence<Parser<string, {}, [typeof a, typeof b, typeof c]>>([a, b, c]);

    it('basic', () => {
      const parser = abc;
      assert.deepStrictEqual(inspect(parser({ source: '', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'a', context: {} })), [['A'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'b', context: {} })), [['B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'c', context: {} })), [['C'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'ab', context: {} })), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'ba', context: {} })), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser({ source: 'aab', context: {} })), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser({ source: 'abb', context: {} })), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser({ source: 'bba', context: {} })), [['B'], 'ba']);
      assert.deepStrictEqual(inspect(parser({ source: 'ac', context: {} })), [['A', 'C'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'bc', context: {} })), [['B', 'C'], '']);
    });

  });

});
