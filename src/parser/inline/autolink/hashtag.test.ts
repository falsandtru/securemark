import { hashtag } from './hashtag';
import { loop } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = loop(hashtag);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), undefined);
      assert.deepStrictEqual(inspect(parser('# ')), undefined);
      assert.deepStrictEqual(inspect(parser('##')), [['##'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##'], 'a']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#'], 'b']);
      assert.deepStrictEqual(inspect(parser('a#http://host')), [['a#'], 'http://host']);
      assert.deepStrictEqual(inspect(parser('a#ttp://host')), [['a#'], 'ttp://host']);
      assert.deepStrictEqual(inspect(parser('a##b')), [['a##'], 'b']);
      assert.deepStrictEqual(inspect(parser('a##http://host')), [['a##'], 'http://host']);
      assert.deepStrictEqual(inspect(parser('a##ttp://host')), [['a##'], 'ttp://host']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#0')), [['<a class="hashtag" rel="noopener">#0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#A')), [['<a class="hashtag" rel="noopener">#A</a>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('#a ')), [['<a class="hashtag" rel="noopener">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<a class="hashtag" rel="noopener">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#a\\')), [['<a class="hashtag" rel="noopener">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#a\\ ')), [['<a class="hashtag" rel="noopener">#a </a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\\\n')), [['<a class="hashtag" rel="noopener">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('#a,')), [['<a class="hashtag" rel="noopener">#a</a>'], ',']);
      assert.deepStrictEqual(inspect(parser('#a;')), [['<a class="hashtag" rel="noopener">#a</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('#a.')), [['<a class="hashtag" rel="noopener">#a</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('#a:')), [['<a class="hashtag" rel="noopener">#a</a>'], ':']);
      assert.deepStrictEqual(inspect(parser('#a!')), [['<a class="hashtag" rel="noopener">#a</a>'], '!']);
      assert.deepStrictEqual(inspect(parser('#a?')), [['<a class="hashtag" rel="noopener">#a</a>'], '?']);
      assert.deepStrictEqual(inspect(parser('#a!?')), [['<a class="hashtag" rel="noopener">#a</a>'], '!?']);
      assert.deepStrictEqual(inspect(parser('#a+')), [['<a class="hashtag" rel="noopener">#a</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('#a-')), [['<a class="hashtag" rel="noopener">#a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('#a*')), [['<a class="hashtag" rel="noopener">#a</a>'], '*']);
      assert.deepStrictEqual(inspect(parser('#a~')), [['<a class="hashtag" rel="noopener">#a</a>'], '~']);
      assert.deepStrictEqual(inspect(parser('#a^')), [['<a class="hashtag" rel="noopener">#a</a>'], '^']);
      assert.deepStrictEqual(inspect(parser(`#a'`)), [['<a class="hashtag" rel="noopener">#a</a>'], `'`]);
      assert.deepStrictEqual(inspect(parser('#a"')), [['<a class="hashtag" rel="noopener">#a</a>'], '"']);
      assert.deepStrictEqual(inspect(parser('#a`')), [['<a class="hashtag" rel="noopener">#a</a>'], '`']);
      assert.deepStrictEqual(inspect(parser('#a|')), [['<a class="hashtag" rel="noopener">#a</a>'], '|']);
      assert.deepStrictEqual(inspect(parser('#a&')), [['<a class="hashtag" rel="noopener">#a&amp;</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a_')), [['<a class="hashtag" rel="noopener">#a_</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a$')), [['<a class="hashtag" rel="noopener">#a$</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a@')), [['<a class="hashtag" rel="noopener">#a@</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a#')), [['<a class="hashtag" rel="noopener">#a#</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a[')), [['<a class="hashtag" rel="noopener">#a</a>'], '[']);
      assert.deepStrictEqual(inspect(parser('#a]')), [['<a class="hashtag" rel="noopener">#a</a>'], ']']);
      assert.deepStrictEqual(inspect(parser('#a(')), [['<a class="hashtag" rel="noopener">#a</a>'], '(']);
      assert.deepStrictEqual(inspect(parser('#a)')), [['<a class="hashtag" rel="noopener">#a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('#a{')), [['<a class="hashtag" rel="noopener">#a</a>'], '{']);
      assert.deepStrictEqual(inspect(parser('#a}')), [['<a class="hashtag" rel="noopener">#a</a>'], '}']);
      assert.deepStrictEqual(inspect(parser('#a<')), [['<a class="hashtag" rel="noopener">#a</a>'], '<']);
      assert.deepStrictEqual(inspect(parser('#a>')), [['<a class="hashtag" rel="noopener">#a</a>'], '>']);
    });

  });

});
