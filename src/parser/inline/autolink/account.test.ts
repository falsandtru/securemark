import { loop } from '../../../combinator/loop';
import { account } from './account';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/autolink/account', () => {
  describe('account', () => {
    const parser = loop(account);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('@')), void 0);
      assert.deepStrictEqual(inspect(parser('@_')), void 0);
      assert.deepStrictEqual(inspect(parser('@-')), void 0);
      assert.deepStrictEqual(inspect(parser('@_a')), void 0);
      assert.deepStrictEqual(inspect(parser('@-a')), void 0);
      assert.deepStrictEqual(inspect(parser('@a@')), void 0);
      assert.deepStrictEqual(inspect(parser('@a@b')), void 0);
      assert.deepStrictEqual(inspect(parser('@a@http://host')), void 0);
      assert.deepStrictEqual(inspect(parser('@a@ttp://host')), void 0);
      assert.deepStrictEqual(inspect(parser('@@')), [['@@'], '']);
      assert.deepStrictEqual(inspect(parser('@@a')), [['@@'], 'a']);
      assert.deepStrictEqual(inspect(parser('a@b')), [['a@'], 'b']);
      assert.deepStrictEqual(inspect(parser('a@http://host')), [['a@ht'], 'tp://host']);
      assert.deepStrictEqual(inspect(parser('a@ttp://host')), [['a@t'], 'tp://host']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@'], 'b']);
      assert.deepStrictEqual(inspect(parser('a@@http://host')), [['a@@ht'], 'tp://host']);
      assert.deepStrictEqual(inspect(parser('a@@ttp://host')), [['a@@t'], 'tp://host']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('@0')), [['<span class="account">@0</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@a')), [['<span class="account">@a</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@A')), [['<span class="account">@A</span>'], '']);
      assert.deepStrictEqual(inspect(parser('@a_b')), [['<span class="account">@a_b</span>'], '']);
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
      assert.deepStrictEqual(inspect(parser('@a@')), void 0);
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
