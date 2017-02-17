import { Parser, Result } from '../parser.d';
import { compose } from './compose';
import { loop } from './loop';

describe('Unit: loop', () => {
  describe('loop', () => {
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

    it('ab', () => {
      const parser = loop(ab, /aaa/);
      assert.deepStrictEqual(parser(''), void 0);
      assert.deepStrictEqual(parser('a'), [['A'], '']);
      assert.deepStrictEqual(parser('b'), [['B'], '']);
      assert.deepStrictEqual(parser('ab'), [['A', 'B'], '']);
      assert.deepStrictEqual(parser('ba'), [['B', 'A'], '']);
      assert.deepStrictEqual(parser('aab'), [['A', 'A', 'B'], '']);
      assert.deepStrictEqual(parser('bba'), [['B', 'B', 'A'], '']);
      assert.deepStrictEqual(parser('aaa'), void 0);
      assert.deepStrictEqual(parser('bbb'), [['B', 'B', 'B'], '']);
      assert.deepStrictEqual(parser('aaab'), void 0);
      assert.deepStrictEqual(parser('baaa'), [['B'], 'aaa']);
    });

  });

});
