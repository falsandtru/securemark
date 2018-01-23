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
      assert.deepStrictEqual(inspect(parser('#0')), [['<span class="hashtag">#0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<span class="hashtag">#a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#A')), [['<span class="hashtag">#A</span>'], '']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('#a ')), [['<span class="hashtag">#a</span>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<span class="hashtag">#a</span>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#a\\')), [['<span class="hashtag">#a</span>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#a\\ ')), [['<span class="hashtag">#a </span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\\\n')), [['<span class="hashtag">#a</span>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('#a,')), [['<span class="hashtag">#a</span>'], ',']);
      assert.deepStrictEqual(inspect(parser('#a;')), [['<span class="hashtag">#a</span>'], ';']);
      assert.deepStrictEqual(inspect(parser('#a.')), [['<span class="hashtag">#a</span>'], '.']);
      assert.deepStrictEqual(inspect(parser('#a:')), [['<span class="hashtag">#a</span>'], ':']);
      assert.deepStrictEqual(inspect(parser('#a!')), [['<span class="hashtag">#a</span>'], '!']);
      assert.deepStrictEqual(inspect(parser('#a?')), [['<span class="hashtag">#a</span>'], '?']);
      assert.deepStrictEqual(inspect(parser('#a!?')), [['<span class="hashtag">#a</span>'], '!?']);
      assert.deepStrictEqual(inspect(parser('#a+')), [['<span class="hashtag">#a</span>'], '+']);
      assert.deepStrictEqual(inspect(parser('#a-')), [['<span class="hashtag">#a</span>'], '-']);
      assert.deepStrictEqual(inspect(parser('#a*')), [['<span class="hashtag">#a</span>'], '*']);
      assert.deepStrictEqual(inspect(parser('#a~')), [['<span class="hashtag">#a</span>'], '~']);
      assert.deepStrictEqual(inspect(parser('#a^')), [['<span class="hashtag">#a</span>'], '^']);
      assert.deepStrictEqual(inspect(parser(`#a'`)), [['<span class="hashtag">#a</span>'], `'`]);
      assert.deepStrictEqual(inspect(parser('#a"')), [['<span class="hashtag">#a</span>'], '"']);
      assert.deepStrictEqual(inspect(parser('#a`')), [['<span class="hashtag">#a</span>'], '`']);
      assert.deepStrictEqual(inspect(parser('#a|')), [['<span class="hashtag">#a</span>'], '|']);
      assert.deepStrictEqual(inspect(parser('#a&')), [['<span class="hashtag">#a&amp;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a_')), [['<span class="hashtag">#a_</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a$')), [['<span class="hashtag">#a$</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a@')), [['<span class="hashtag">#a@</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a#')), [['<span class="hashtag">#a#</span>'], '']);
      assert.deepStrictEqual(inspect(parser('#a[')), [['<span class="hashtag">#a</span>'], '[']);
      assert.deepStrictEqual(inspect(parser('#a]')), [['<span class="hashtag">#a</span>'], ']']);
      assert.deepStrictEqual(inspect(parser('#a(')), [['<span class="hashtag">#a</span>'], '(']);
      assert.deepStrictEqual(inspect(parser('#a)')), [['<span class="hashtag">#a</span>'], ')']);
      assert.deepStrictEqual(inspect(parser('#a{')), [['<span class="hashtag">#a</span>'], '{']);
      assert.deepStrictEqual(inspect(parser('#a}')), [['<span class="hashtag">#a</span>'], '}']);
      assert.deepStrictEqual(inspect(parser('#a<')), [['<span class="hashtag">#a</span>'], '<']);
      assert.deepStrictEqual(inspect(parser('#a>')), [['<span class="hashtag">#a</span>'], '>']);
    });

  });

});
