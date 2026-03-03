import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashtag', () => {
  describe('hashtag', () => {
    const parser = (source: string) => some(autolink)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('# '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a#'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a#b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a#b#c'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#a@b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#@'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#@a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#\\'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#\\ '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#\\\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('##'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('##a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('###a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(`#'`), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(`#'0`), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(`#'00`), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#_'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#_a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#(a)'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#{{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#{}}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#{#}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#{a}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#12345a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('#　'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' #a'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('#a'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a '), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('#a\n'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('#a\\'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('#a\\ '), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('#a\\\n'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('#a)'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('#a(b'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b']);
      assert.deepStrictEqual(inspect(parser('#a(b)'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '(b)']);
      assert.deepStrictEqual(inspect(parser('#a_'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('#a_b'), ctx), [['<a class="hashtag" href="/hashtags/a_b">#a_b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a__b'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('#あ'), ctx), [['<a class="hashtag" href="/hashtags/あ">#あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#👩'), ctx), [['<a class="hashtag" href="/hashtags/👩">#👩</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1a'), ctx), [['<a class="hashtag" href="/hashtags/1a">#1a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1あ'), ctx), [['<a class="hashtag" href="/hashtags/1あ">#1あ</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#1👩'), ctx), [['<a class="hashtag" href="/hashtags/1👩">#1👩</a>'], '']);
      assert.deepStrictEqual(inspect(parser(`#a'`), ctx), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser(`#a''`), ctx), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser(`#a'b`), ctx), [[`<a class="hashtag" href="/hashtags/a'b">#a'b</a>`], '']);
      assert.deepStrictEqual(inspect(parser(`#a'0`), ctx), [[`<a class="hashtag" href="/hashtags/a'0">#a'0</a>`], '']);
      assert.deepStrictEqual(inspect(parser(`#a'_b`), ctx), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `'_b`]);
      assert.deepStrictEqual(inspect(parser(`#a_'b`), ctx), [[`<a class="hashtag" href="/hashtags/a">#a</a>`], `_'b`]);
      assert.deepStrictEqual(inspect(parser('#1234a'), ctx), [['<a class="hashtag" href="/hashtags/1234a">#1234a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a+b'), ctx), [['<a class="hashtag" href="/hashtags/a">#a</a>'], '+b']);
    });

  });

});
