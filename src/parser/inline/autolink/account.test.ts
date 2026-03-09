import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@+', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@_', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@-', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@.', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a@b@c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@ab@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@@', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@@a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@@@a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@#a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a_b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a.b:c', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@a.domain.com:b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('@http://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' @a', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('@a', new Context())), [['<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@A', new Context())), [['<a class="account" href="/@A">@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a-', new Context())), [['<a class="account" href="/@a">@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser, input('@a-b', new Context())), [['<a class="account" href="/@a-b">@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@a--b', new Context())), [['<a class="account" href="/@a">@a</a>'], '--b']);
      assert.deepStrictEqual(inspect(parser, input('@a_', new Context())), [['<a class="account" href="/@a">@a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser, input('@a.', new Context())), [['<a class="account" href="/@a">@a</a>'], '.']);
      assert.deepStrictEqual(inspect(parser, input('@a.domain.com', new Context())), [['<a class="account" href="/@a.domain.com">@a.domain.com</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@domain/a', new Context())), [['<a class="account" href="https://domain/@a" target="_blank">@domain/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('@domain.com/a', new Context())), [['<a class="account" href="https://domain.com/@a" target="_blank">@domain.com/a</a>'], '']);
    });

  });

});
