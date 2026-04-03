import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@+')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@_')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@-')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@.')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@b@c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@ab@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@@')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@@a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@@@a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@#')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@#a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a_b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a.b:c')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a.domain.com:b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('@http://host')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' @a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('@a')), [['<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@A')), [['<a class="account" href="/@A">@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a-')), [['<a class="account" href="/@a">@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input('@a-b')), [['<a class="account" href="/@a-b">@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a--b')), [['<a class="account" href="/@a">@a</a>'], '--b']);
      assert.deepStrictEqual(inspect(parser, input('@a_')), [['<a class="account" href="/@a">@a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input('@a.')), [['<a class="account" href="/@a">@a</a>'], '.']);
      assert.deepStrictEqual(inspect(parser, input('@a.domain.com')), [['<a class="account" href="/@a.domain.com">@a.domain.com</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@domain/a')), [['<a class="account" href="https://domain/@a" target="_blank">@domain/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@domain.com/a')), [['<a class="account" href="https://domain.com/@a" target="_blank">@domain.com/a</a>'], '']);
    });

  });

});
