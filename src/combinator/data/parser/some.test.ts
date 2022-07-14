import { Parser } from '../parser';
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
      assert.deepStrictEqual(inspect(parser({ source: '', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'a', context: {} })), [['A'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'b', context: {} })), [['B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'ab', context: {} })), [['A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'ba', context: {} })), [['B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'aab', context: {} })), [['A', 'A', 'B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'bba', context: {} })), [['B', 'B', 'A'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'aaa', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'bbb', context: {} })), [['B', 'B', 'B'], '']);
      assert.deepStrictEqual(inspect(parser({ source: 'aaab', context: {} })), undefined);
      assert.deepStrictEqual(inspect(parser({ source: 'baaa', context: {} })), [['B'], 'aaa']);
    });

  });

});
