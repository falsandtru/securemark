import { Parser, input } from '../parser';
import { union } from './union';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/union', () => {
  describe('union', () => {
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
    const ab = union<Parser<string, {}, [typeof a, typeof b]>>([a, b]);

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser(input('', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', {}))), [['A'], '']);
      assert.deepStrictEqual(inspect(parser(input('b', {}))), [['B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ab', {}))), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser(input('ba', {}))), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser(input('aab', {}))), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser(input('abb', {}))), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser(input('bba', {}))), [['B'], 'ba']);
    });

  });

});
