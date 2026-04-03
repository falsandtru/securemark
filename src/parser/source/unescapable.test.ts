import { unescsource } from './unescapable';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/unescapable', () => {
  describe('unescsource', () => {
    const parser = some(unescsource);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser, input('a b c')), [['a', ' b c'], '']);
      assert.deepStrictEqual(inspect(parser, input('09あいAZaz')), [['09', 'あいAZaz'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser, input(' ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser, input('  ')), [['  '], '']);
      assert.deepStrictEqual(inspect(parser, input('   ')), [['   '], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n')), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \n')), [['  ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('   \n')), [['   ', '<br>'], '']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(inspect(parser, input('\n\n')), [['<br>', '<br>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser, input('\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\')), [['\\', '\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ ')), [['\\', ' '], '']);
      assert.deepStrictEqual(inspect(parser, input('\\_')), [['\\', '_'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\0')), [['\\0'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\a')), [['\\a'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\`')), [['\\', '`'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\　')), [['\\', '　'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\n')), [['\\', '<br>'], '']);
    });

  });

});
