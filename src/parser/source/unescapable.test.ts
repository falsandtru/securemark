import { unescsource } from './unescapable';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/unescapable', () => {
  describe('unescsource', () => {
    const parser = some(unescsource);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser, input('a b c', new Context())), [['a', ' b c'], '']);
      assert.deepStrictEqual(inspect(parser, input('09あいAZaz', new Context())), [['09', 'あいAZaz'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser, input(' ', new Context())), [[' '], '']);
      assert.deepStrictEqual(inspect(parser, input('  ', new Context())), [['  '], '']);
      assert.deepStrictEqual(inspect(parser, input('   ', new Context())), [['   '], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n', new Context())), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \n', new Context())), [['  ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('   \n', new Context())), [['   ', '<br>'], '']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(inspect(parser, input('\n\n', new Context())), [['<br>', '<br>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser, input('\\', new Context())), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\', new Context())), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\', new Context())), [['\\', '\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ ', new Context())), [['\\', ' '], '']);
      assert.deepStrictEqual(inspect(parser, input('\\_', new Context())), [['\\', '_'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\0', new Context())), [['\\0'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\a', new Context())), [['\\a'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\`', new Context())), [['\\', '`'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\　', new Context())), [['\\', '　'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\n', new Context())), [['\\', '<br>'], '']);
    });

  });

});
