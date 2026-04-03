import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('# ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a#b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a#b#c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a@b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#@a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\ ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('##')), undefined);
      assert.deepStrictEqual(inspect(parser, input('##a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('###a')), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#'`)), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#'0`)), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#'00`)), undefined);
      assert.deepStrictEqual(inspect(parser, input('#_')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#_a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#(a)')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{{}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{#}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{a}')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#12345a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('#　')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' #a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('#a')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a ')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser, input('#a\n')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser, input('#a\\')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser, input('#a\\ ')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser, input('#a\\\n')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser, input('#a)')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser, input('#a(b')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b']);
      assert.deepStrictEqual(inspect(parser, input('#a(b)')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b)']);
      assert.deepStrictEqual(inspect(parser, input('#a_')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input('#a_b')), [['<a class="hashtag" href="/hashtags/a_b">#a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a__b')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser, input('#あ')), [['<a class="hashtag" href="/hashtags/あ">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#😀')), [['<a class="hashtag" href="/hashtags/😀">#😀</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#🤚🏽')), [['<a class="hashtag" href="/hashtags/🤚🏽">#🤚🏽</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#👨‍👩‍👧')), [['<a class="hashtag" href="/hashtags/👨‍👩‍👧">#👨‍👩‍👧</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#🇺🇳')), [['<a class="hashtag" href="/hashtags/🇺🇳">#🇺🇳</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('##️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣')), [['<a class="hashtag" href="/hashtags/#️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣">##️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1a')), [['<a class="hashtag" href="/hashtags/1a">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1あ')), [['<a class="hashtag" href="/hashtags/1あ">#1あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1😀')), [['<a class="hashtag" href="/hashtags/1😀">#1😀</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`#a'`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser, input(`#a''`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser, input(`#a'b`)), [[`<a class="hashtag" href="/hashtags/a'b">#a'b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(`#a'0`)), [[`<a class="hashtag" href="/hashtags/a'0">#a'0</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(`#a'_b`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'_b`]);
      assert.deepStrictEqual(inspect(parser, input(`#a_'b`)), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `_'b`]);
      assert.deepStrictEqual(inspect(parser, input('#1234a')), [['<a class="hashtag" href="/hashtags/1234a">#1234a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a+b')), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '+b']);
    });

  });

});
