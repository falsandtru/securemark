import { Parser, Result } from './parser';
import { combine } from './combine';

describe('Unit: combinator/combine', () => {
  describe('combine', () => {
    const a: Parser<string, never> = (source: string): Result<string, never> => {
      return source && source[0] === 'a'
        ? [['A'], source.slice(1)]
        : undefined;
    }
    const b: Parser<string, never> = (source: string): Result<string, never> => {
      return source && source[0] === 'b'
        ? [['B'], source.slice(1)]
        : undefined;
    }
    const ab = combine<string, [typeof a, typeof b]>([a, b]);

    it('a', () => {
      const parser = a;
      assert.deepStrictEqual(parser(''), undefined);
      assert.deepStrictEqual(parser('a'), [['A'], '']);
      assert.deepStrictEqual(parser('b'), undefined);
      assert.deepStrictEqual(parser('ab'), [['A'], 'b']);
      assert.deepStrictEqual(parser('ba'), undefined);
      assert.deepStrictEqual(parser('aab'), [['A'], 'ab']);
      assert.deepStrictEqual(parser('bba'), undefined);
    });

    it('b', () => {
      const parser = b;
      assert.deepStrictEqual(parser(''), undefined);
      assert.deepStrictEqual(parser('a'), undefined);
      assert.deepStrictEqual(parser('b'), [['B'], '']);
      assert.deepStrictEqual(parser('ab'), undefined);
      assert.deepStrictEqual(parser('ba'), [['B'], 'a']);
      assert.deepStrictEqual(parser('aab'), undefined);
      assert.deepStrictEqual(parser('bba'), [['B'], 'ba']);
    });

    it('ab', () => {
      const parser = ab;
      assert.deepStrictEqual(parser(''), undefined);
      assert.deepStrictEqual(parser('a'), [['A'], '']);
      assert.deepStrictEqual(parser('b'), [['B'], '']);
      assert.deepStrictEqual(parser('ab'), [['A'], 'b']);
      assert.deepStrictEqual(parser('ba'), [['B'], 'a']);
      assert.deepStrictEqual(parser('aab'), [['A'], 'ab']);
      assert.deepStrictEqual(parser('bba'), [['B'], 'ba']);
    });

  });

});
