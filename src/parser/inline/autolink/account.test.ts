import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = (source: string) => some(autolink)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('@'), ctx), [['@'], '']);
      assert.deepStrictEqual(inspect(parser('@+'), ctx), [['@'], '+']);
      assert.deepStrictEqual(inspect(parser('@_'), ctx), [['@'], '_']);
      assert.deepStrictEqual(inspect(parser('@-'), ctx), [['@'], '-']);
      assert.deepStrictEqual(inspect(parser('@.'), ctx), [['@'], '.']);
      assert.deepStrictEqual(inspect(parser('@0'), ctx), [['@0'], '']);
      assert.deepStrictEqual(inspect(parser('@a@'), ctx), [['@a'], '@']);
      assert.deepStrictEqual(inspect(parser('@a@b'), ctx), [['@a'], '@b']);
      assert.deepStrictEqual(inspect(parser('@a@b@c'), ctx), [['@a'], '@b@c']);
      assert.deepStrictEqual(inspect(parser('@ab@'), ctx), [['@ab'], '@']);
      assert.deepStrictEqual(inspect(parser('@@'), ctx), [['@@'], '']);
      assert.deepStrictEqual(inspect(parser('@@a'), ctx), [['@@a'], '']);
      assert.deepStrictEqual(inspect(parser('@@@a'), ctx), [['@@@a'], '']);
      assert.deepStrictEqual(inspect(parser('@#'), ctx), [['@', '#'], '']);
      assert.deepStrictEqual(inspect(parser('@#a'), ctx), [['@', '<a class="hashtag" href="/hashtags/a">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a'), ctx), [['<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@A'), ctx), [['<a class="account" href="/@A">@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a_b'), ctx), [['<a class="account" href="/@a">@a</a>'], '_b']);
      assert.deepStrictEqual(inspect(parser('@a__b'), ctx), [['<a class="account" href="/@a">@a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('@a-'), ctx), [['<a class="account" href="/@a">@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('@a-b'), ctx), [['<a class="account" href="/@a-b">@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a--b'), ctx), [['<a class="account" href="/@a">@a</a>'], '--b']);
      assert.deepStrictEqual(inspect(parser('@a.'), ctx), [['<a class="account" href="/@a">@a</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('@a.domain.com'), ctx), [['<a class="account" href="/@a.domain.com">@a.domain.com</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@http://host'), ctx), [['@http'], '://host']);
      assert.deepStrictEqual(inspect(parser('@ttp://host'), ctx), [ [ '@ttp' ], '://host' ]);
      assert.deepStrictEqual(inspect(parser('@domain/a'), ctx), [['<a class="account" href="https://domain/@a" target="_blank">@domain/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain.com/a'), ctx), [['<a class="account" href="https://domain.com/@a" target="_blank">@domain.com/a</a>'], '']);
    });

  });

});
