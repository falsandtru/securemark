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
      assert.deepStrictEqual(inspect(parser('  ')), [[' ', ' '], '']);
    });

    it('newlinw', () => {
      assert.deepStrictEqual(inspect(parser('\n')), [['<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n ')), [['<span class="linebreak"> </span>', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[' ', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [['<span class="linebreak"> </span>', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n')), [[' ', '<span class="linebreak"> </span>', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n \n')), [['<span class="linebreak"> </span>', ' ', '<span class="linebreak"> </span>'], '']);
      assert.deepStrictEqual(inspect(parser('\n\n ')), [['<span class="linebreak"> </span>', '<span class="linebreak"> </span>', ' '], '']);
      assert.deepStrictEqual(inspect(parser('。\n')), [['。', '<span class="linebreak"> </span>'], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), [[''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\', ''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\0')), [['0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\a')), [['\\', 'a'], '']);
    });

    it('break', () => {
      assert.deepStrictEqual(inspect(parser('\\\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\n ')), [['<br>', ' '], '']);
      assert.deepStrictEqual(inspect(parser('\\\na')), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb\\\n')), [['a', '<br>', 'b', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\n')), [['\\', '<br>'], '']);
    });

    it('url', () => {
      assert.deepStrictEqual(inspect(parser('http:')), [['http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('https:')), [['https', ':'], '']);
      assert.deepStrictEqual(inspect(parser('_http:')), [['_', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('$http:')), [['$', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('+http:')), [['+', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('-http:')), [['-', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('0http:')), [['0', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('ahttp:')), [['a', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('Ahttp:')), [['A', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp:')), [['0a', 'A', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser(' http:')), [[' ', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('hhttp:')), [['h', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('!http:')), [['!', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('?http:')), [['?', 'http', ':'], '']);
      assert.deepStrictEqual(inspect(parser('#sec')), [['#', 'sec'], '']);
      assert.deepStrictEqual(inspect(parser('0#sec')), [['0', '#', 'sec'], '']);
      assert.deepStrictEqual(inspect(parser('a#sec')), [['a', '#', 'sec'], '']);
      assert.deepStrictEqual(inspect(parser('A#sec')), [['A', '#', 'sec'], '']);
      assert.deepStrictEqual(inspect(parser('0aA#sec')), [['0aA', '#', 'sec'], '']);
      assert.deepStrictEqual(inspect(parser('!#sec')), [['!', '#', 'sec'], '']);
      assert.deepStrictEqual(inspect(parser('?#sec')), [['?', '#', 'sec'], '']);
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
      assert.deepStrictEqual(inspect(parser('0aA@0')), [['0a', 'A', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' @0')), [[' ', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('@@0')), [['@', '@', '0'], '']);
    });

  });

});
