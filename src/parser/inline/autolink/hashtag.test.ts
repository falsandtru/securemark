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
      assert.deepStrictEqual(inspect(parser('#a_')), [['#a_'], '']);
      assert.deepStrictEqual(inspect(parser('#a__b')), [['#a__b'], '']);
      assert.deepStrictEqual(inspect(parser(`#a_'b`)), [[`#a_'b`], '']);
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
      assert.deepStrictEqual(inspect(parser('#12345a')), [['#12345a'], '']);
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
      assert.deepStrictEqual(inspect(parser('#a(b)')), [['<a class="hashtag" href="/hashtags/a(b)">#a(b)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a((b))')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '((b))']);
      assert.deepStrictEqual(inspect(parser(`#a'`)), [[`<a class="hashtag" href="/hashtags/a'">#a'</a>`], '']);
      assert.deepStrictEqual(inspect(parser(`#a(b')`)), [[`<a class="hashtag" href="/hashtags/a(b')">#a(b')</a>`], '']);
      assert.deepStrictEqual(inspect(parser(`#a(b'')`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `(b'')`]);
      assert.deepStrictEqual(inspect(parser(`#a('b)`)), [['<a class="hashtag" href="/hashtags/a">#a</a>'], `('b)`]);
      assert.deepStrictEqual(inspect(parser('#a_b')), [['<a class="hashtag" href="/hashtags/a_b">#a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`#a'_b`)), [[`<a class="hashtag" href="/hashtags/a'_b">#a'_b</a>`], '']);
      assert.deepStrictEqual(inspect(parser('#a(b_c)')), [['<a class="hashtag" href="/hashtags/a(b_c)">#a(b_c)</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a(b__c)')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b__c)']);
      assert.deepStrictEqual(inspect(parser('#あ')), [['<a class="hashtag" href="/hashtags/あ">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1a')), [['<a class="hashtag" href="/hashtags/1a">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1あ')), [['<a class="hashtag" href="/hashtags/1あ">#1あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1234a')), [['<a class="hashtag" href="/hashtags/1234a">#1234a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#domain/a')), [['<a class="hashtag" href="https://domain/hashtags/a" target="_blank">#domain/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#domain.co.jp/a')), [['<a class="hashtag" href="https://domain.co.jp/hashtags/a" target="_blank">#domain.co.jp/a</a>'], '']);
    });

  });

});
