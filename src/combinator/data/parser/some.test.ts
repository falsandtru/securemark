import { Parser, input } from '../parser';
import { union } from './union';
import { some } from './some';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/some', () => {
  describe('some', () => {
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
      const parser = some(ab, /^aaa/);
      assert.deepStrictEqual(inspect(parser(input('', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', {}))), [['A'], '']);
      assert.deepStrictEqual(inspect(parser(input('b', {}))), [['B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ab', {}))), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('ba', {}))), [['B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser(input('aab', {}))), [['A', 'A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('bba', {}))), [['B', 'B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser(input('aaa', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('bbb', {}))), [['B', 'B', 'B'], '']);
      assert.deepStrictEqual(inspect(parser(input('aaab', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('baaa', {}))), [['B'], 'aaa']);
    });

  });

});
