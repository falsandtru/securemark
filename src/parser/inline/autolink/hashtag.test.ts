import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

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
      assert.deepStrictEqual(inspect(parser(`#'`)), [['#'], `'`]);
      assert.deepStrictEqual(inspect(parser(`#'0`)), [[`#`], `'0`]);
      assert.deepStrictEqual(inspect(parser(`#'00`)), [[`#`], `'00`]);
      assert.deepStrictEqual(inspect(parser('#_')), [['#'], '_']);
      assert.deepStrictEqual(inspect(parser('#_a')), [['#'], '_a']);
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
      assert.deepStrictEqual(inspect(parser(' #a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a ')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#a\\')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#a\\ ')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#a\\\n')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('#a)')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('#a(b')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b']);
      assert.deepStrictEqual(inspect(parser('#a(b)')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b)']);
      assert.deepStrictEqual(inspect(parser('#a_')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('#a_b')), [['<a class="hashtag" href="/hashtags/a_b">#a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a__b')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('#あ')), [['<a class="hashtag" href="/hashtags/あ">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#👩')), [['<a class="hashtag" href="/hashtags/👩">#👩</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1a')), [['<a class="hashtag" href="/hashtags/1a">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1あ')), [['<a class="hashtag" href="/hashtags/1あ">#1あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1👩')), [['<a class="hashtag" href="/hashtags/1👩">#1👩</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`#a'`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser(`#a''`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser(`#a'b`)), [[`<a class="hashtag" href="/hashtags/a'b">#a'b</a>`], '']);
      assert.deepStrictEqual(inspect(parser(`#a'0`)), [[`<a class="hashtag" href="/hashtags/a'0">#a'0</a>`], '']);
      assert.deepStrictEqual(inspect(parser(`#a'_b`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'_b`]);
      assert.deepStrictEqual(inspect(parser(`#a_'b`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `_'b`]);
      assert.deepStrictEqual(inspect(parser(`#${'1'.repeat(9)}a`)), [[`<a class="hashtag" href="/hashtags/${'1'.repeat(9)}a">#${'1'.repeat(9)}a</a>`], '']);
    });

  });

});
