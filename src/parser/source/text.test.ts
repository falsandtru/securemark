import { text } from './text';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/text', () => {
  describe('text', () => {
    const parser = some(text);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser, input('a b c', new Context())), [['a b c'], '']);
      assert.deepStrictEqual(inspect(parser, input('09あいAZaz', new Context())), [['09あいAZaz'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nb', new Context())), [['a', '<br>', 'b'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser, input('\\', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\', new Context())), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\', new Context())), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\\\', new Context())), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ ', new Context())), [[' '], '']);
      assert.deepStrictEqual(inspect(parser, input('\\_', new Context())), [['_'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\0', new Context())), [['0'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\a', new Context())), [['\\', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\　', new Context())), [['　'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\。', new Context())), [['。'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser, input(' ', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('  ', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('   ', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \r\n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \r\n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \\\n', new Context())), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \\\n', new Context())), [[' ', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' a', new Context())), [[' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('  a', new Context())), [[' ', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('   a', new Context())), [['  ', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a ', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  ', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \n', new Context())), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \r\n', new Context())), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  \n', new Context())), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  \r\n', new Context())), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \\\n', new Context())), [['a', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  \\\n', new Context())), [['a', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a b', new Context())), [['a b'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  b', new Context())), [['a', ' b'], '']);
      assert.deepStrictEqual(inspect(parser, input('a   b', new Context())), [['a', ' b'], '']);
    });

    it('hardbreak', () => {
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n ', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n\n', new Context())), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n\n', new Context())), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n \n', new Context())), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n\n ', new Context())), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('。\n', new Context())), [['。', '<br>'], '']);
    });

    it('softbreak', () => {
      assert.deepStrictEqual(inspect(parser, input('\\\n', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\n ', new Context())), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\na', new Context())), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\n', new Context())), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\nb\\\n', new Context())), [['a', '<br>', 'b', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\\n', new Context())), [['\\', '<br>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser, input('@0', new Context())), [['@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('_@0', new Context())), [['_', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('$@0', new Context())), [['$', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('+@0', new Context())), [['+', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('-@0', new Context())), [['-', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('0@0', new Context())), [['0', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@0', new Context())), [['a', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('A@0', new Context())), [['A', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('aA@0', new Context())), [['aA', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input(' @0', new Context())), [[' ', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('@@0', new Context())), [['@', '@0'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser, input('#0', new Context())), [['#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('_#0', new Context())), [['_', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('$#0', new Context())), [['$', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('+#0', new Context())), [['+', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('-#0', new Context())), [['-', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('0#0', new Context())), [['0', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('a#0', new Context())), [['a', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('A#0', new Context())), [['A', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('aA#0', new Context())), [['aA', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input(' #0', new Context())), [[' ', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('##0', new Context())), [['#', '#0'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser, input('>>0', new Context())), [['>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('_>>0', new Context())), [['_', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('$>>0', new Context())), [['$', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('+>>0', new Context())), [['+', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('->>0', new Context())), [['-', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('0>>0', new Context())), [['0', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('a>>0', new Context())), [['a', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('A>>0', new Context())), [['A', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('aA>>0', new Context())), [['aA', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input(' >>0', new Context())), [[' ', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>>>0', new Context())), [['>', '>', '>', '>0'], '']);
    });

  });

});
