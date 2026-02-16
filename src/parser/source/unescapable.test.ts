import { unescsource } from './unescapable';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/unescapable', () => {
  describe('unescsource', () => {
    const parser = (source: string) => some(unescsource)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('09あいAZaz')), [['09', 'あ', 'い', 'AZaz'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('  ')), [[' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser('   ')), [['  ', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('  \n')), [[' ', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('   \n')), [['  ', ' ', '<br>'], '']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(inspect(parser('\n\n')), [['<br>', '<br>'], '']);
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
      assert.deepStrictEqual(inspect(parser('\\\n')), [['\\', '<br>'], '']);
    });

  });

});
