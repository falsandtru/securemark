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
      assert.deepStrictEqual(inspect(parser(`#'`)), [[`#'`], '']);
      assert.deepStrictEqual(inspect(parser(`#a''`)), [[`#a''`], '']);
      assert.deepStrictEqual(inspect(parser('#_')), [['#_'], '']);
      assert.deepStrictEqual(inspect(parser('#(a)')), [['#'], '(a)']);
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
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(127)}_`)), [[`#${'1'.repeat(127)}_`], '']);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(127)}_a`)), [[`#${'1'.repeat(127)}_a`], '']);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(127)}_'a`)), [[`#${'1'.repeat(127)}_'a`], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a ')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#a\\')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#a\\ ')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#a\\\n')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('#a)')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('#a(b')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '(b']);
      assert.deepStrictEqual(inspect(parser('#a(b)')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '(b)']);
      assert.deepStrictEqual(inspect(parser('#a_')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('#a_b')), [['<a href="/hashtags/a_b" class="hashtag">#a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`#a_'b`)), [['<a href="/hashtags/a" class="hashtag">#a</a>'], `_'b`]);
      assert.deepStrictEqual(inspect(parser('#a__b')), [['<a href="/hashtags/a" class="hashtag">#a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('#あ')), [['<a href="/hashtags/あ" class="hashtag">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#👩')), [['<a href="/hashtags/👩" class="hashtag">#👩</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1a')), [['<a href="/hashtags/1a" class="hashtag">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1あ')), [['<a href="/hashtags/1あ" class="hashtag">#1あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1👩')), [['<a href="/hashtags/1👩" class="hashtag">#1👩</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#domain/a')), [['<a href="https://domain/hashtags/a" target="_blank" class="hashtag">#domain/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#domain.co.jp/a')), [['<a href="https://domain.co.jp/hashtags/a" target="_blank" class="hashtag">#domain.co.jp/a</a>'], '']);
      // Reserved
      assert.deepStrictEqual(inspect(parser(`#a'`)), [[`#a'`], '']);
      assert.deepStrictEqual(inspect(parser(`#a'b`)), [[`#a'b`], '']);
      assert.deepStrictEqual(inspect(parser(`#a'_b`)), [[`#a'_b`], '']);
    });

  });

});
