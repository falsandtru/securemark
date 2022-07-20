import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = (source: string) => some(autolink)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('@')), [['@'], '']);
      assert.deepStrictEqual(inspect(parser('@+')), [['@'], '+']);
      assert.deepStrictEqual(inspect(parser('@_')), [['@'], '_']);
      assert.deepStrictEqual(inspect(parser('@-')), [['@'], '-']);
      assert.deepStrictEqual(inspect(parser('@.')), [['@'], '.']);
      assert.deepStrictEqual(inspect(parser('@0')), [['@0'], '']);
      assert.deepStrictEqual(inspect(parser('@a@')), [['@a@'], '']);
      assert.deepStrictEqual(inspect(parser('@a@b')), [['@a@b'], '']);
      assert.deepStrictEqual(inspect(parser('@a@b@c')), [['@a@b@c'], '']);
      assert.deepStrictEqual(inspect(parser('@ab@')), [['@ab@'], '']);
      assert.deepStrictEqual(inspect(parser('@a@b')), [['@a@b'], '']);
      assert.deepStrictEqual(inspect(parser('@@')), [['@@'], '']);
      assert.deepStrictEqual(inspect(parser('@@a')), [['@@a'], '']);
      assert.deepStrictEqual(inspect(parser('@@@a')), [['@@@a'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" href="/@a">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@A')), [['<a class="account" href="/@A">@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a_b')), [['<a class="account" href="/@a">@a</a>'], '_b']);
      assert.deepStrictEqual(inspect(parser('@a__b')), [['<a class="account" href="/@a">@a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('@a-')), [['<a class="account" href="/@a">@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('@a-b')), [['<a class="account" href="/@a-b">@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a--b')), [['<a class="account" href="/@a">@a</a>'], '--b']);
      assert.deepStrictEqual(inspect(parser('@http://host')), [['<a class="account" href="/@http">@http</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('@ttp://host')), [['<a class="account" href="/@ttp">@ttp</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('@domain/a')), [['<a class="account" href="https://domain/@a" target="_blank">@domain/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain.co.jp/a')), [['<a class="account" href="https://domain.co.jp/@a" target="_blank">@domain.co.jp/a</a>'], '']);
    });

  });

});
