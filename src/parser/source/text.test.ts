import { text } from './text';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/text', () => {
  describe('text', () => {
    const parser = (source: string) => some(text)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a'), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab'), ctx), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('09あいAZaz'), ctx), [['09', 'あ', 'い', 'AZaz'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb'), ctx), [['a', '<br>', 'b'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('\\'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\\\'), ctx), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\'), ctx), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\\'), ctx), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\ '), ctx), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\\_'), ctx), [['_'], '']);
      assert.deepStrictEqual(inspect(parser('\\0'), ctx), [['0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a'), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\a'), ctx), [['\\', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('\\　'), ctx), [['　'], '']);
      assert.deepStrictEqual(inspect(parser('\\。'), ctx), [['。'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' '), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('  '), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('   '), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('  \n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' \\\n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('  \\\n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' a'), ctx), [[' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('  a'), ctx), [[' ', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('   a'), ctx), [['  ', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a '), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a  '), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a \n'), ctx), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a  \n'), ctx), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a \\\n'), ctx), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a  \\\n'), ctx), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a b'), ctx), [['a', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a  b'), ctx), [['a', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a   b'), ctx), [['a', ' ', 'b'], '']);
    });

    it('hardbreak', () => {
      assert.deepStrictEqual(inspect(parser('\n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n '), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n'), ctx), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n'), ctx), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n \n'), ctx), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n '), ctx), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('。\n'), ctx), [['。', '<br>'], '']);
    });

    it('softbreak', () => {
      assert.deepStrictEqual(inspect(parser('\\\n'), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n '), ctx), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na'), ctx), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n'), ctx), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb\\\n'), ctx), [['a', '<br>', 'b', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\n'), ctx), [['\\', '<br>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@0'), ctx), [['@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('_@0'), ctx), [['_', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('$@0'), ctx), [['$', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('+@0'), ctx), [['+', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('-@0'), ctx), [['-', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0@0'), ctx), [['0', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('a@0'), ctx), [['a', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('A@0'), ctx), [['A', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('aA@0'), ctx), [['aA', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' @0'), ctx), [[' ', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('@@0'), ctx), [['@', '@', '0'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#0'), ctx), [['#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('_#0'), ctx), [['_', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('$#0'), ctx), [['$', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('+#0'), ctx), [['+', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('-#0'), ctx), [['-', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0#0'), ctx), [['0', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('a#0'), ctx), [['a', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('A#0'), ctx), [['A', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('aA#0'), ctx), [['aA', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' #0'), ctx), [[' ', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('##0'), ctx), [['#', '#', '0'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser('>>0'), ctx), [['>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('_>>0'), ctx), [['_', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('$>>0'), ctx), [['$', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('+>>0'), ctx), [['+', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('->>0'), ctx), [['-', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0>>0'), ctx), [['0', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('a>>0'), ctx), [['a', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('A>>0'), ctx), [['A', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('aA>>0'), ctx), [['aA', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' >>0'), ctx), [[' ', '>', '>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('>>>>0'), ctx), [['>', '>', '>', '>', '0'], '']);
    });

  });

});
