import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a#b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a#b#c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#a@b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#@a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\ ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('##', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('##a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('###a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#'`, new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#'0`, new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#'00`, new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#_', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#_a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#(a)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{#}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{a}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#12345a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#　', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' #a', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('#a', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a ', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser, input('#a\n', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser, input('#a\\', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser, input('#a\\ ', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser, input('#a\\\n', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser, input('#a)', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser, input('#a(b', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b']);
      assert.deepStrictEqual(inspect(parser, input('#a(b)', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b)']);
      assert.deepStrictEqual(inspect(parser, input('#a_', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input('#a_b', new Context())), [['<a class="hashtag" href="/hashtags/a_b">#a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a__b', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser, input('#あ', new Context())), [['<a class="hashtag" href="/hashtags/あ">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#😀', new Context())), [['<a class="hashtag" href="/hashtags/😀">#😀</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#🤚🏽', new Context())), [['<a class="hashtag" href="/hashtags/🤚🏽">#🤚🏽</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#👨‍👩‍👧', new Context())), [['<a class="hashtag" href="/hashtags/👨‍👩‍👧">#👨‍👩‍👧</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#🇺🇳', new Context())), [['<a class="hashtag" href="/hashtags/🇺🇳">#🇺🇳</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('##️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣', new Context())), [['<a class="hashtag" href="/hashtags/#️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣">##️⃣*️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1a', new Context())), [['<a class="hashtag" href="/hashtags/1a">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1あ', new Context())), [['<a class="hashtag" href="/hashtags/1あ">#1あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1😀', new Context())), [['<a class="hashtag" href="/hashtags/1😀">#1😀</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`#a'`, new Context())), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser, input(`#a''`, new Context())), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser, input(`#a'b`, new Context())), [[`<a class="hashtag" href="/hashtags/a'b">#a'b</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(`#a'0`, new Context())), [[`<a class="hashtag" href="/hashtags/a'0">#a'0</a>`], '']);
      assert.deepStrictEqual(inspect(parser, input(`#a'_b`, new Context())), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'_b`]);
      assert.deepStrictEqual(inspect(parser, input(`#a_'b`, new Context())), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `_'b`]);
      assert.deepStrictEqual(inspect(parser, input('#1234a', new Context())), [['<a class="hashtag" href="/hashtags/1234a">#1234a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#a+b', new Context())), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '+b']);
    });

  });

});
