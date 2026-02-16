import { Parser, input } from '../parser';
import { sequence } from './sequence';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/sequence', () => {
  describe('sequence', () => {
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
    const ab = sequence<Parser<string, {}, [typeof a, typeof b]>>([a, b]);

    it('basic', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser(input('', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('b', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('ab', {}))), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ba', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('aab', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('abb', {}))), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser(input('bba', {}))), undefined);
    });

  });

});
