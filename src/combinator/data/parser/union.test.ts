import { Parser } from '../parser';
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
      assert.deepStrictEqual(inspect(parser({ source: '', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'a', context: {} })), [['A'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'b', context: {} })), [['B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'ab', context: {} })), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser({ source: 'ba', context: {} })), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser({ source: 'aab', context: {} })), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser({ source: 'abb', context: {} })), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser({ source: 'bba', context: {} })), [['B'], 'ba']);
    });

  });

});
