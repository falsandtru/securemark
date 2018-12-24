import { inblock } from './inblock';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inblock', () => {
  describe('inblock', () => {
    const parser = some(inblock);

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#', 'a', '#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#', 'a', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a class="hashtag" rel="noopener">#a</a>', '<span class="linebreak"> </span>', 'b', '<span class="linebreak"> </span>', '<a class="hashtag" rel="noopener">#c</a>', '<span class="linebreak"> </span>', '<a href="#index:d" rel="noopener">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('####a')), [['####', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a\n#b')), [['a', '<span class="linebreak"> </span>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n#b')), [['a', '<br>', '<a class="hashtag" rel="noopener">#b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*a*#b')), [['<em>a</em>', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation">a</sup>', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="authority">a</sup>', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['[', '#', 'a'], '']);
      assert.deepStrictEqual(inspect(parser(' [#a')), [[' ', '[', '#', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '#', 'a'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a class="hashtag" rel="noopener">#a</a>'], '']);
    });

    it('email', () => {
      assert.deepStrictEqual(inspect(parser('a@b')), [['<a class="email" href="mailto:a@b" rel="noopener">a@b</a>'], '']);
    });

  });

});
