import { text } from './text';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/text/text', () => {
  describe('text', () => {
    const parser = some(text);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['a', '<span class="linebreak"> </span>', 'b'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' ')), [[], '']);
      assert.deepStrictEqual(inspect(parser('  ')), [[], '']);
      assert.deepStrictEqual(inspect(parser('   ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('  \n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [[' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('  a')), [[' ', ' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a  ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['a', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('a  \n')), [['a', '<span class="linebreak"> </span>'], '']);
    });

    it('newlinw', () => {
      assert.deepStrictEqual(inspect(parser('\n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n ')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [['<span class="linebreak"> </span>', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n')), [['<span class="linebreak"> </span>', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n \n')), [['<span class="linebreak"> </span>', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n ')), [['<span class="linebreak"> </span>', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('。\n')), [['。', '<span class="linebreak"> </span>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), [[''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\', ''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\ ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\\_')), [['_'], '']);
      assert.deepStrictEqual(inspect(parser('\\0')), [['0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\a')), [['\\', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('\\　')), [['　'], '']);
      assert.deepStrictEqual(inspect(parser('\\。')), [['。'], '']);
    });

    it('break', () => {
      assert.deepStrictEqual(inspect(parser('\\\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n ')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na')), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb\\\n')), [['a', '<br>', 'b', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\n')), [['\\', '<br>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@0')), [['@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('_@0')), [['_', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('$@0')), [['$', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('+@0')), [['+', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('-@0')), [['-', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0@0')), [['0', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('a@0')), [['a', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('A@0')), [['A', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0aA@0')), [['0', 'a', 'A', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' @0')), [[' ', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('@@0')), [['@', '@', '0'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#0')), [['#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('_#0')), [['_', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('$#0')), [['$', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('+#0')), [['+', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('-#0')), [['-', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0#0')), [['0', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('a#0')), [['a', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('A#0')), [['A', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0aA#0')), [['0', 'a', 'A', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' #0')), [[' ', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('##0')), [['#', '#', '0'], '']);
    });

  });

});
