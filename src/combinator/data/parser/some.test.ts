import { Parser } from '../parser';
import { union } from './union';
import { some } from './some';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/data/parser/some', () => {
  describe('some', () => {
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
    const ab = union<Parser<string, {}, [typeof a, typeof b]>>([a, b]);

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
