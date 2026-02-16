import { Parser, input } from '../parser';
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
      assert.deepStrictEqual(inspect(parser(input('', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', {}))), [['A'], '']);
      assert.deepStrictEqual(inspect(parser(input('b', {}))), [['B'], '']);
      assert.deepStrictEqual(inspect(parser(input('c', {}))), [['C'], '']);
      assert.deepStrictEqual(inspect(parser(input('ab', {}))), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ba', {}))), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser(input('aab', {}))), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser(input('abb', {}))), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser(input('bba', {}))), [['B'], 'ba']);
      assert.deepStrictEqual(inspect(parser(input('ac', {}))), [['A', 'C'], '']);
      assert.deepStrictEqual(inspect(parser(input('bc', {}))), [['B', 'C'], '']);
    });

  });

});
