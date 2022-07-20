import { reference } from './reference';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/reference', () => {
  describe('reference', () => {
    const parser = (source: string) => some(reference)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[')), undefined);
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ ]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ [a')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\na]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\\na]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[*a\nb*]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a]b]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[[a]]')), undefined);
      assert.deepStrictEqual(inspect(parser(' [[a]]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[[ a]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ a ]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\ a]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<wbr>a]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a ]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a  ]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a &nbsp;]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a <wbr>]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ab]]')), [['<sup class="reference"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[[`a`]]')), [['<sup class="reference"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[@a]]')), [['<sup class="reference"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[http://host]]')), [['<sup class="reference"><span><a href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]]')), [['<sup class="reference"><span>!<a class="link" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]')), [['<sup class="reference"><span>[a]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference"><span>[[a]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[((a))]]')), [['<sup class="reference"><span><span class="paren">((a))</span></span></sup>'], '']);
    });

    it('abbr', () => {
      assert.deepStrictEqual(inspect(parser('[[^]]')), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a,]]')), [['<sup class="reference" data-abbr="a,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a, ]]')), [['<sup class="reference" data-abbr="a,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a ]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a  ]]')), [['<sup class="invalid"><span>^a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a b]]')), [['<sup class="reference" data-abbr="a b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a  b]]')), [['<sup class="invalid"><span>^a  b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a,|]]')), [['<sup class="reference" data-abbr="a,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a |]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b]]')), [['<sup class="reference" data-abbr="a"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b]]')), [['<sup class="reference" data-abbr="a"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b ]]')), [['<sup class="reference" data-abbr="a"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b  ]]')), [['<sup class="reference" data-abbr="a"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|<wbr>]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|<wbr>b]]')), [['<sup class="reference" data-abbr="a"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|^b]]')), [['<sup class="reference" data-abbr="a"><span>^b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| ]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| b]]')), [['<sup class="reference" data-abbr="a"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|  ]]')), [['<sup class="reference" data-abbr="a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1]]')), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1a]]')), [['<sup class="reference" data-abbr="1a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 ]]')), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 a]]')), [['<sup class="reference" data-abbr="1 a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1|]]')), [['<sup class="invalid"><span>^1|</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 |]]')), [['<sup class="invalid"><span>^1 |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz2020]]')), [['<sup class="reference" data-abbr="Xyz2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020]]')), [['<sup class="reference" data-abbr="Xyz 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz, 2020, p1-2]]')), [['<sup class="reference" data-abbr="Xyz, 2020, p1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^X. Y., Z et al., 2020, p1-2]]')), [['<sup class="reference" data-abbr="X. Y., Z et al., 2020, p1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser(`[[^A's, Aces']]`)), [[`<sup class="reference" data-abbr="A's, Aces'"><span></span></sup>`], '']);
      assert.deepStrictEqual(inspect(parser('[[^^]]')), [['<sup class="invalid"><span>^^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\^]]')), [['<sup class="reference"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ ]]')), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ a]]')), [['<sup class="invalid"><span>^ a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |]]')), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |b]]')), [['<sup class="invalid"><span>^ |b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | ]]')), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | b]]')), [['<sup class="invalid"><span>^ | b</span></sup>'], '']);
    });

  });

});
