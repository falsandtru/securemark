import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = (source: string) => some(autolink)(source, {});

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
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" href="/@a" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@A')), [['<a class="account" href="/@A" rel="noopener">@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a_b')), [['<a class="account" href="/@a" rel="noopener">@a</a>'], '_b']);
      assert.deepStrictEqual(inspect(parser('@a__b')), [['<a class="account" href="/@a" rel="noopener">@a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('@a-')), [['<a class="account" href="/@a" rel="noopener">@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('@a-b')), [['<a class="account" href="/@a-b" rel="noopener">@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a--b')), [['<a class="account" href="/@a" rel="noopener">@a</a>'], '--b']);
      assert.deepStrictEqual(inspect(parser('@http://host')), [['<a class="account" href="/@http" rel="noopener">@http</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('@ttp://host')), [['<a class="account" href="/@ttp" rel="noopener">@ttp</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('@domain.com/a')), [['<a class="account" href="https://domain.com/@a" rel="noopener">@domain.com/a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@domain.co.jp/a')), [['<a class="account" href="https://domain.co.jp/@a" rel="noopener">@domain.co.jp/a</a>'], '']);
    });

  });

});
