import { account } from './account';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = some(account);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('@')), undefined);
      assert.deepStrictEqual(inspect(parser('@_')), undefined);
      assert.deepStrictEqual(inspect(parser('@-')), undefined);
      assert.deepStrictEqual(inspect(parser('@_a')), undefined);
      assert.deepStrictEqual(inspect(parser('@-a')), undefined);
      assert.deepStrictEqual(inspect(parser('@a@')), undefined);
      assert.deepStrictEqual(inspect(parser('@a@b')), undefined);
      assert.deepStrictEqual(inspect(parser('@a@http://host')), undefined);
      assert.deepStrictEqual(inspect(parser('@a@ttp://host')), undefined);
      assert.deepStrictEqual(inspect(parser('@@')), [['@@'], '']);
      assert.deepStrictEqual(inspect(parser('@@a')), [['@@'], 'a']);
      assert.deepStrictEqual(inspect(parser('a@b')), [['a@'], 'b']);
      assert.deepStrictEqual(inspect(parser('a@http://host')), [['a@'], 'http://host']);
      assert.deepStrictEqual(inspect(parser('a@ttp://host')), [['a@'], 'ttp://host']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@'], 'b']);
      assert.deepStrictEqual(inspect(parser('a@@http://host')), [['a@@'], 'http://host']);
      assert.deepStrictEqual(inspect(parser('a@@ttp://host')), [['a@@'], 'ttp://host']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@0')), [['<a class="account" rel="noopener">@0</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@A')), [['<a class="account" rel="noopener">@A</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a_b')), [['<a class="account" rel="noopener">@a</a>'], '_b']);
      assert.deepStrictEqual(inspect(parser('@a__b')), [['<a class="account" rel="noopener">@a</a>'], '__b']);
      assert.deepStrictEqual(inspect(parser('@a-b')), [['<a class="account" rel="noopener">@a-b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a--b')), [['<a class="account" rel="noopener">@a</a>'], '--b']);
      assert.deepStrictEqual(inspect(parser('@http://host')), [['<a class="account" rel="noopener">@http</a>'], '://host']);
      assert.deepStrictEqual(inspect(parser('@ttp://host')), [['<a class="account" rel="noopener">@ttp</a>'], '://host']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('@a ')), [['<a class="account" rel="noopener">@a</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser('@a\n')), [['<a class="account" rel="noopener">@a</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser('@a\\')), [['<a class="account" rel="noopener">@a</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser('@a\\ ')), [['<a class="account" rel="noopener">@a</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('@a\\\n')), [['<a class="account" rel="noopener">@a</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('@a,')), [['<a class="account" rel="noopener">@a</a>'], ',']);
      assert.deepStrictEqual(inspect(parser('@a;')), [['<a class="account" rel="noopener">@a</a>'], ';']);
      assert.deepStrictEqual(inspect(parser('@a.')), [['<a class="account" rel="noopener">@a</a>'], '.']);
      assert.deepStrictEqual(inspect(parser('@a:')), [['<a class="account" rel="noopener">@a</a>'], ':']);
      assert.deepStrictEqual(inspect(parser('@a!')), [['<a class="account" rel="noopener">@a</a>'], '!']);
      assert.deepStrictEqual(inspect(parser('@a?')), [['<a class="account" rel="noopener">@a</a>'], '?']);
      assert.deepStrictEqual(inspect(parser('@a!?')), [['<a class="account" rel="noopener">@a</a>'], '!?']);
      assert.deepStrictEqual(inspect(parser('@a+')), [['<a class="account" rel="noopener">@a</a>'], '+']);
      assert.deepStrictEqual(inspect(parser('@a-')), [['<a class="account" rel="noopener">@a</a>'], '-']);
      assert.deepStrictEqual(inspect(parser('@a*')), [['<a class="account" rel="noopener">@a</a>'], '*']);
      assert.deepStrictEqual(inspect(parser('@a~')), [['<a class="account" rel="noopener">@a</a>'], '~']);
      assert.deepStrictEqual(inspect(parser('@a^')), [['<a class="account" rel="noopener">@a</a>'], '^']);
      assert.deepStrictEqual(inspect(parser(`@a'`)), [['<a class="account" rel="noopener">@a</a>'], `'`]);
      assert.deepStrictEqual(inspect(parser('@a"')), [['<a class="account" rel="noopener">@a</a>'], '"']);
      assert.deepStrictEqual(inspect(parser('@a`')), [['<a class="account" rel="noopener">@a</a>'], '`']);
      assert.deepStrictEqual(inspect(parser('@a|')), [['<a class="account" rel="noopener">@a</a>'], '|']);
      assert.deepStrictEqual(inspect(parser('@a&')), [['<a class="account" rel="noopener">@a</a>'], '&']);
      assert.deepStrictEqual(inspect(parser('@a_')), [['<a class="account" rel="noopener">@a</a>'], '_']);
      assert.deepStrictEqual(inspect(parser('@a$')), [['<a class="account" rel="noopener">@a</a>'], '$']);
      assert.deepStrictEqual(inspect(parser('@a@')), undefined);
      assert.deepStrictEqual(inspect(parser('@a#')), [['<a class="account" rel="noopener">@a</a>'], '#']);
      assert.deepStrictEqual(inspect(parser('@a[')), [['<a class="account" rel="noopener">@a</a>'], '[']);
      assert.deepStrictEqual(inspect(parser('@a]')), [['<a class="account" rel="noopener">@a</a>'], ']']);
      assert.deepStrictEqual(inspect(parser('@a(')), [['<a class="account" rel="noopener">@a</a>'], '(']);
      assert.deepStrictEqual(inspect(parser('@a)')), [['<a class="account" rel="noopener">@a</a>'], ')']);
      assert.deepStrictEqual(inspect(parser('@a{')), [['<a class="account" rel="noopener">@a</a>'], '{']);
      assert.deepStrictEqual(inspect(parser('@a}')), [['<a class="account" rel="noopener">@a</a>'], '}']);
      assert.deepStrictEqual(inspect(parser('@a<')), [['<a class="account" rel="noopener">@a</a>'], '<']);
      assert.deepStrictEqual(inspect(parser('@a>')), [['<a class="account" rel="noopener">@a</a>'], '>']);
    });

  });

});
