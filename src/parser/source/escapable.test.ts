import { escsource } from './escapable';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/escsource', () => {
  describe('escsource', () => {
    const parser = (source: string) => some(escsource)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a'), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab'), ctx), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('09あいAZaz'), ctx), [['09', 'あ', 'い', 'AZaz'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' '), ctx), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('  '), ctx), [[' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser('   '), ctx), [['  ', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n'), ctx), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('  \n'), ctx), [[' ', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('   \n'), ctx), [['  ', ' ', '<br>'], '']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(inspect(parser('\n\n'), ctx), [['<br>', '<br>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\'), ctx), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\'), ctx), [['\\\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\'), ctx), [['\\\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\ '), ctx), [['\\ '], '']);
      assert.deepStrictEqual(inspect(parser('\\_'), ctx), [['\\_'], '']);
      assert.deepStrictEqual(inspect(parser('\\0'), ctx), [['\\0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a'), ctx), [['\\a'], '']);
      assert.deepStrictEqual(inspect(parser('\\$'), ctx), [['\\$'], '']);
      assert.deepStrictEqual(inspect(parser('\\　'), ctx), [['\\　'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n'), ctx), [['\\', '<br>'], '']);
    });

  });

});
