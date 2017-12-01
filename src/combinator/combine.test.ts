import { Parser, Result } from './parser';
import { combine } from './combine';
import { inspect } from '../debug.test';

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
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), [['A'], '']);
      assert.deepStrictEqual(inspect(parser('b')), undefined);
      assert.deepStrictEqual(inspect(parser('ab')), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser('ba')), undefined);
      assert.deepStrictEqual(inspect(parser('aab')), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser('abb')), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser('bba')), undefined);
    });

    it('b', () => {
      const parser = b;
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), undefined);
      assert.deepStrictEqual(inspect(parser('b')), [['B'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), undefined);
      assert.deepStrictEqual(inspect(parser('ba')), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser('aab')), undefined);
      assert.deepStrictEqual(inspect(parser('abb')), undefined);
      assert.deepStrictEqual(inspect(parser('bba')), [['B'], 'ba']);
    });

    it('ab', () => {
      const parser = ab;
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), [['A'], '']);
      assert.deepStrictEqual(inspect(parser('b')), [['B'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['A'], 'b']);
      assert.deepStrictEqual(inspect(parser('ba')), [['B'], 'a']);
      assert.deepStrictEqual(inspect(parser('aab')), [['A'], 'ab']);
      assert.deepStrictEqual(inspect(parser('abb')), [['A'], 'bb']);
      assert.deepStrictEqual(inspect(parser('bba')), [['B'], 'ba']);
    });

  });

});
