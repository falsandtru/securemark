import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = (source: string) => some(autolink)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('#')), [['#'], '']);
      assert.deepStrictEqual(inspect(parser('# ')), [['#'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a#')), [['#a#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#a#b'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b#c')), [['#a#b#c'], '']);
      assert.deepStrictEqual(inspect(parser('#a@b')), [['#a@b'], '']);
      assert.deepStrictEqual(inspect(parser('#\\')), [['#'], '\\']);
      assert.deepStrictEqual(inspect(parser('#\\ ')), [['#'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#\\\n')), [['#'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('##')), [['##'], '']);
      assert.deepStrictEqual(inspect(parser('##a')), [['##a'], '']);
      assert.deepStrictEqual(inspect(parser('###a')), [['###a'], '']);
      assert.deepStrictEqual(inspect(parser('#{}')), [['#'], '{}']);
      assert.deepStrictEqual(inspect(parser('#{{}')), [['#'], '{{}']);
      assert.deepStrictEqual(inspect(parser('#{}}')), [['#'], '{}}']);
      assert.deepStrictEqual(inspect(parser('#{#}')), [['#'], '{#}']);
      assert.deepStrictEqual(inspect(parser('#{a}')), [['#'], '{a}']);
      assert.deepStrictEqual(inspect(parser('#　')), [['#'], '　']);
      assert.deepStrictEqual(inspect(parser('a#1')), [['a#1'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a#b'], '']);
      assert.deepStrictEqual(inspect(parser('a##1')), [['a##1'], '']);
      assert.deepStrictEqual(inspect(parser('a##b')), [['a##b'], '']);
      assert.deepStrictEqual(inspect(parser('あ#b')), [['あ#b'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a ')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#a\\')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#a\\ ')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#a\\\n')), [['<a class="hashtag" href="/hashtag/a" rel="noopener">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('#あ')), [['<a class="hashtag" href="/hashtag/あ" rel="noopener">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1a')), [['<a class="hashtag" href="/hashtag/1a" rel="noopener">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1あ')), [['<a class="hashtag" href="/hashtag/1あ" rel="noopener">#1あ</a>'], '']);
    });

  });

});
