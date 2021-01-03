import { text } from './text';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/text/text', () => {
  describe('text', () => {
    const parser = (source: string) => some(text)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('az')), [['az'], '']);
      assert.deepStrictEqual(inspect(parser('09')), [['09'], '']);
      assert.deepStrictEqual(inspect(parser('azあい09')), [['az', 'あい', '09'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['a', '<br>', 'b'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser(' ')), [[], '']);
      assert.deepStrictEqual(inspect(parser('  ')), [[], '']);
      assert.deepStrictEqual(inspect(parser('   ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('  \n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' \\\n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('  \\\n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [[' ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('  a')), [['  ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('   a')), [['   ', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a  ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a  \n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a \\\n')), [['a', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('a  \\\n')), [['a', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('a b')), [['a', ' ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a  b')), [['a', '  ', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a   b')), [['a', '   ', 'b'], '']);
    });

    it('newlinw', () => {
      assert.deepStrictEqual(inspect(parser('\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n ')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n \n')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n ')), [['<br>', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('。\n')), [['。', '<br>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\'], '']);
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
      assert.deepStrictEqual(inspect(parser('\\\n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n ')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na')), [['<span class="linebreak"> </span>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['a', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb\\\n')), [['a', '<span class="linebreak"> </span>', 'b', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\n')), [['\\', '<span class="linebreak"> </span>'], '']);
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
      assert.deepStrictEqual(inspect(parser('0aA@0')), [['0aA', '@', '0'], '']);
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
      assert.deepStrictEqual(inspect(parser(' #0')), [[' ', '#', '0'], '']);
      assert.deepStrictEqual(inspect(parser('##0')), [['#', '#', '0'], '']);
    });

    it('localize', () => {
      assert.deepStrictEqual(inspect(parser('.\\\n0')), [['.', '<span class="linebreak"> </span>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('。\\\n0')), [['。', '<span class="linebreak"></span>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('。 \\\n0')), [['。', '<span class="linebreak"></span>', '0'], '']);
      assert.deepStrictEqual(inspect(parser('。。\\\n0')), [['。', '。', '<span class="linebreak"></span>', '0'], '']);
    });

  });

});
