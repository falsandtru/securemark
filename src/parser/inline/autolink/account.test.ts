import { account } from './account';
import { loop } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = loop(account);

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
      assert.deepStrictEqual(inspect(parser('@0')), [['<span class="account">@0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@a')), [['<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@A')), [['<span class="account">@A</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@a_b')), [['<span class="account">@a</span>'], '_b']);
      assert.deepStrictEqual(inspect(parser('@a__b')), [['<span class="account">@a</span>'], '__b']);
      assert.deepStrictEqual(inspect(parser('@a-b')), [['<span class="account">@a-b</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@a--b')), [['<span class="account">@a</span>'], '--b']);
      assert.deepStrictEqual(inspect(parser('@http://host')), [['<span class="account">@http</span>'], '://host']);
      assert.deepStrictEqual(inspect(parser('@ttp://host')), [['<span class="account">@ttp</span>'], '://host']);
    });

    it('trailing symbols', () => {
      assert.deepStrictEqual(inspect(parser('@a ')), [['<span class="account">@a</span>'], ' ']);
      assert.deepStrictEqual(inspect(parser('@a\n')), [['<span class="account">@a</span>'], '\n']);
      assert.deepStrictEqual(inspect(parser('@a\\')), [['<span class="account">@a</span>'], '\\']);
      assert.deepStrictEqual(inspect(parser('@a\\ ')), [['<span class="account">@a</span>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser('@a\\\n')), [['<span class="account">@a</span>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser('@a,')), [['<span class="account">@a</span>'], ',']);
      assert.deepStrictEqual(inspect(parser('@a;')), [['<span class="account">@a</span>'], ';']);
      assert.deepStrictEqual(inspect(parser('@a.')), [['<span class="account">@a</span>'], '.']);
      assert.deepStrictEqual(inspect(parser('@a:')), [['<span class="account">@a</span>'], ':']);
      assert.deepStrictEqual(inspect(parser('@a!')), [['<span class="account">@a</span>'], '!']);
      assert.deepStrictEqual(inspect(parser('@a?')), [['<span class="account">@a</span>'], '?']);
      assert.deepStrictEqual(inspect(parser('@a!?')), [['<span class="account">@a</span>'], '!?']);
      assert.deepStrictEqual(inspect(parser('@a+')), [['<span class="account">@a</span>'], '+']);
      assert.deepStrictEqual(inspect(parser('@a-')), [['<span class="account">@a</span>'], '-']);
      assert.deepStrictEqual(inspect(parser('@a*')), [['<span class="account">@a</span>'], '*']);
      assert.deepStrictEqual(inspect(parser('@a~')), [['<span class="account">@a</span>'], '~']);
      assert.deepStrictEqual(inspect(parser('@a^')), [['<span class="account">@a</span>'], '^']);
      assert.deepStrictEqual(inspect(parser(`@a'`)), [['<span class="account">@a</span>'], `'`]);
      assert.deepStrictEqual(inspect(parser('@a"')), [['<span class="account">@a</span>'], '"']);
      assert.deepStrictEqual(inspect(parser('@a`')), [['<span class="account">@a</span>'], '`']);
      assert.deepStrictEqual(inspect(parser('@a|')), [['<span class="account">@a</span>'], '|']);
      assert.deepStrictEqual(inspect(parser('@a&')), [['<span class="account">@a</span>'], '&']);
      assert.deepStrictEqual(inspect(parser('@a_')), [['<span class="account">@a</span>'], '_']);
      assert.deepStrictEqual(inspect(parser('@a$')), [['<span class="account">@a</span>'], '$']);
      assert.deepStrictEqual(inspect(parser('@a@')), undefined);
      assert.deepStrictEqual(inspect(parser('@a#')), [['<span class="account">@a</span>'], '#']);
      assert.deepStrictEqual(inspect(parser('@a[')), [['<span class="account">@a</span>'], '[']);
      assert.deepStrictEqual(inspect(parser('@a]')), [['<span class="account">@a</span>'], ']']);
      assert.deepStrictEqual(inspect(parser('@a(')), [['<span class="account">@a</span>'], '(']);
      assert.deepStrictEqual(inspect(parser('@a)')), [['<span class="account">@a</span>'], ')']);
      assert.deepStrictEqual(inspect(parser('@a{')), [['<span class="account">@a</span>'], '{']);
      assert.deepStrictEqual(inspect(parser('@a}')), [['<span class="account">@a</span>'], '}']);
      assert.deepStrictEqual(inspect(parser('@a<')), [['<span class="account">@a</span>'], '<']);
      assert.deepStrictEqual(inspect(parser('@a>')), [['<span class="account">@a</span>'], '>']);
    });

  });

});
