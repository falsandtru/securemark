import { unescsource } from './unescapable';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/unescapable', () => {
  describe('unescsource', () => {
    const parser = (source: string) => some(unescsource)(input(source, ctx));
    const { context: ctx } = input('', new Context());

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a'), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab'), ctx), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('a b c'), ctx), [['a', ' b', ' c'], '']);
      assert.deepStrictEqual(inspect(parser('09あいAZaz'), ctx), [['09', 'あいAZaz'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' '), ctx), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('  '), ctx), [['  '], '']);
      assert.deepStrictEqual(inspect(parser('   '), ctx), [['   '], '']);
      assert.deepStrictEqual(inspect(parser(' \n'), ctx), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('  \n'), ctx), [['  ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('   \n'), ctx), [['   ', '<br>'], '']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(inspect(parser('\n\n'), ctx), [['<br>', '<br>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\'), ctx), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\'), ctx), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\'), ctx), [['\\', '\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\ '), ctx), [['\\', ' '], '']);
      assert.deepStrictEqual(inspect(parser('\\_'), ctx), [['\\', '_'], '']);
      assert.deepStrictEqual(inspect(parser('\\0'), ctx), [['\\0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a'), ctx), [['\\a'], '']);
      assert.deepStrictEqual(inspect(parser('\\`'), ctx), [['\\', '`'], '']);
      assert.deepStrictEqual(inspect(parser('\\　'), ctx), [['\\', '　'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n'), ctx), [['\\', '<br>'], '']);
    });

  });

});
