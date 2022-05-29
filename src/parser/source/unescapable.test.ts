import { unescsource } from './unescapable';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/unescapable', () => {
  describe('unescsource', () => {
    const parser = (source: string) => some(unescsource)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('09あいAZaz')), [['09', 'あい', 'AZaz'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('  ')), [[' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser('   ')), [['  ', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[' ', '\n'], '']);
      assert.deepStrictEqual(inspect(parser('  \n')), [[' ', ' ', '\n'], '']);
      assert.deepStrictEqual(inspect(parser('   \n')), [['  ', ' ', '\n'], '']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(inspect(parser('\n\n')), [['\n', '\n'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\', '\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\ ')), [['\\', ' '], '']);
      assert.deepStrictEqual(inspect(parser('\\_')), [['\\', '_'], '']);
      assert.deepStrictEqual(inspect(parser('\\0')), [['\\', '0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['\\', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('\\`')), [['\\', '`'], '']);
      assert.deepStrictEqual(inspect(parser('\\　')), [['\\', '　'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [['\\', '\n'], '']);
    });

  });

});
