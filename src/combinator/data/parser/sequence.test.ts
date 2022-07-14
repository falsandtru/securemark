import { Parser } from '../parser';
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
      assert.deepStrictEqual(inspect(parser({ source: '', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'a', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'b', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'ab', context: {} })), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'ba', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'aab', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'abb', context: {} })), [['A', 'B'], 'b']);
      assert.deepStrictEqual(inspect(parser({ source: 'bba', context: {} })), undefined);
    });

  });

});
