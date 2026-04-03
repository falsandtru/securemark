import { text } from './text';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/text', () => {
  describe('text', () => {
    const parser = some(text);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser, input('a b c')), [['a b c'], '']);
      assert.deepStrictEqual(inspect(parser, input('09あいAZaz')), [['09あいAZaz'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nb')), [['a', '<br>', 'b'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser, input('\\')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser, input('\\_')), [['_'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\0')), [['0'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\a')), [['\\', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\　')), [['　'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\。')), [['。'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser, input(' ')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('  ')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('   ')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \r\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \r\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \\\n')), [[' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('  \\\n')), [[' ', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' a')), [[' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('  a')), [[' ', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('   a')), [['  ', ' a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \r\n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  \n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  \r\n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a \\\n')), [['a', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  \\\n')), [['a', ' ', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a b')), [['a b'], '']);
      assert.deepStrictEqual(inspect(parser, input('a  b')), [['a', ' b'], '']);
      assert.deepStrictEqual(inspect(parser, input('a   b')), [['a', ' b'], '']);
    });

    it('hardbreak', () => {
      assert.deepStrictEqual(inspect(parser, input('\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n ')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n\n')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' \n\n')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n \n')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\n\n ')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('。\n')), [['。', '<br>'], '']);
    });

    it('softbreak', () => {
      assert.deepStrictEqual(inspect(parser, input('\\\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\n ')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\na')), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('a\\\nb\\\n')), [['a', '<br>', 'b', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser, input('\\\\\\\n')), [['\\', '<br>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser, input('@0')), [['@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('_@0')), [['_', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('$@0')), [['$', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('+@0')), [['+', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('-@0')), [['-', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('0@0')), [['0', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('a@0')), [['a', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('A@0')), [['A', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('aA@0')), [['aA', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input(' @0')), [[' ', '@0'], '']);
      assert.deepStrictEqual(inspect(parser, input('@@0')), [['@', '@0'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser, input('#0')), [['#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('_#0')), [['_', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('$#0')), [['$', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('+#0')), [['+', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('-#0')), [['-', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('0#0')), [['0', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('a#0')), [['a', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('A#0')), [['A', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('aA#0')), [['aA', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input(' #0')), [[' ', '#0'], '']);
      assert.deepStrictEqual(inspect(parser, input('##0')), [['#', '#0'], '']);
    });

    it('anchor', () => {
      assert.deepStrictEqual(inspect(parser, input('>>0')), [['>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('_>>0')), [['_', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('$>>0')), [['$', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('+>>0')), [['+', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('->>0')), [['-', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('0>>0')), [['0', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('a>>0')), [['a', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('A>>0')), [['A', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('aA>>0')), [['aA', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input(' >>0')), [[' ', '>', '>0'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>>>0')), [['>', '>', '>', '>0'], '']);
    });

  });

});
