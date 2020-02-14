import { bracket } from './bracket';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/bracket', () => {
  describe('bracket', () => {
    const parser = (source: string) => some(bracket)(source, {});

    it('(', () => {
      assert.deepStrictEqual(inspect(parser('(')), [['('], '']);
      assert.deepStrictEqual(inspect(parser('()')), [['(', ')'], '']);
      assert.deepStrictEqual(inspect(parser('(a')), [['(', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('(a)')), [['(', 'a', ')'], '']);
      assert.deepStrictEqual(inspect(parser(')')), undefined);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser('[')), [['['], '']);
      assert.deepStrictEqual(inspect(parser('[]')), [['[', ']'], '']);
      assert.deepStrictEqual(inspect(parser('[a')), [['[', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('[a]')), [['[', 'a', ']'], '']);
      assert.deepStrictEqual(inspect(parser(']')), undefined);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser('{')), [['{'], '']);
      assert.deepStrictEqual(inspect(parser('{}')), [['{', '}'], '']);
      assert.deepStrictEqual(inspect(parser('{a')), [['{', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('{a}')), [['{', 'a', '}'], '']);
      assert.deepStrictEqual(inspect(parser('}')), undefined);
    });

  });

});
