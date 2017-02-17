import { Parser, Result } from '../parser.d';
import { compose } from './compose';

describe('Unit: compose', () => {
  describe('compose', () => {
    const a: Parser<string, never> = (source: string): Result<string, never> => {
      return source && source[0] === 'a'
        ? [['A'], source.slice(1)]
        : void 0;
    }
    const b: Parser<string, never> = (source: string): Result<string, never> => {
      return source && source[0] === 'b'
        ? [['B'], source.slice(1)]
        : void 0;
    }
    const ab = compose<[typeof a, typeof b], string>([a, b]);

    it('a', () => {
      const parser = a;
      assert.deepStrictEqual(parser(''), void 0);
      assert.deepStrictEqual(parser('a'), [['A'], '']);
      assert.deepStrictEqual(parser('b'), void 0);
      assert.deepStrictEqual(parser('ab'), [['A'], 'b']);
      assert.deepStrictEqual(parser('ba'), void 0);
      assert.deepStrictEqual(parser('aab'), [['A'], 'ab']);
      assert.deepStrictEqual(parser('bba'), void 0);
    });

    it('b', () => {
      const parser = b;
      assert.deepStrictEqual(parser(''), void 0);
      assert.deepStrictEqual(parser('a'), void 0);
      assert.deepStrictEqual(parser('b'), [['B'], '']);
      assert.deepStrictEqual(parser('ab'), void 0);
      assert.deepStrictEqual(parser('ba'), [['B'], 'a']);
      assert.deepStrictEqual(parser('aab'), void 0);
      assert.deepStrictEqual(parser('bba'), [['B'], 'ba']);
    });

    it('ab', () => {
      const parser = ab;
      assert.deepStrictEqual(parser(''), void 0);
      assert.deepStrictEqual(parser('a'), [['A'], '']);
      assert.deepStrictEqual(parser('b'), [['B'], '']);
      assert.deepStrictEqual(parser('ab'), [['A'], 'b']);
      assert.deepStrictEqual(parser('ba'), [['B'], 'a']);
      assert.deepStrictEqual(parser('aab'), [['A'], 'ab']);
      assert.deepStrictEqual(parser('bba'), [['B'], 'ba']);
    });

  });

});
