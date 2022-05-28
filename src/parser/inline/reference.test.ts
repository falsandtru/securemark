import { reference } from './reference';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/reference', () => {
  describe('reference', () => {
    const parser = (source: string) => some(reference)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('[')), undefined);
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ ]]')), undefined);
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
      assert.deepStrictEqual(inspect(parser('[[ a]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ a ]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\ a]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<wbr>a]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a ]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a  ]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a &nbsp;]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a <wbr>]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ab]]')), [['<sup class="reference">ab</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[[`a`]]')), [['<sup class="reference"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[@a]]')), [['<sup class="reference"><a href="/@a" class="account">@a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[http://host]]')), [['<sup class="reference"><a href="http://host" target="_blank">http://host</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]]')), [['<sup class="reference">!<a href="a">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<a>]]')), [['<sup class="reference">&lt;a&gt;</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]')), [['<sup class="reference">[a]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference">[[a]]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[((a))]]')), [['<sup class="reference"><span class="paren">((a))</span></sup>'], '']);
    });

    it('abbr', () => {
      assert.deepStrictEqual(inspect(parser('[[^]]')), [['<sup class="invalid">^</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a,]]')), [['<sup class="reference" data-abbr="a,"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a, ]]')), [['<sup class="reference" data-abbr="a,"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a ]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a  ]]')), [['<sup class="invalid">^a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a b]]')), [['<sup class="reference" data-abbr="a b"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a  b]]')), [['<sup class="invalid">^a  b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a,|]]')), [['<sup class="reference" data-abbr="a,"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a |]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b]]')), [['<sup class="reference" data-abbr="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b]]')), [['<sup class="reference" data-abbr="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b ]]')), [['<sup class="reference" data-abbr="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b  ]]')), [['<sup class="reference" data-abbr="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|<wbr>]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|<wbr>b]]')), [['<sup class="reference" data-abbr="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|^b]]')), [['<sup class="reference" data-abbr="a">^b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| ]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| b]]')), [['<sup class="reference" data-abbr="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|  ]]')), [['<sup class="reference" data-abbr="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1]]')), [['<sup class="invalid">^1</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1a]]')), [['<sup class="reference" data-abbr="1a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 ]]')), [['<sup class="invalid">^1</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 a]]')), [['<sup class="reference" data-abbr="1 a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1|]]')), [['<sup class="invalid">^1|</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 |]]')), [['<sup class="invalid">^1 |</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz2020]]')), [['<sup class="reference" data-abbr="Xyz2020"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020]]')), [['<sup class="reference" data-abbr="Xyz 2020"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz, 2020, p1-2]]')), [['<sup class="reference" data-abbr="Xyz, 2020, p1-2"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^X. Y., Z et al., 2020, p1-2]]')), [['<sup class="reference" data-abbr="X. Y., Z et al., 2020, p1-2"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser(`[[^A's, Aces']]`)), [[`<sup class="reference" data-abbr="A's, Aces'"></sup>`], '']);
      assert.deepStrictEqual(inspect(parser('[[^^]]')), [['<sup class="invalid">^^</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\^]]')), [['<sup class="reference">^</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ ]]')), [['<sup class="invalid">^ </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ a]]')), [['<sup class="invalid">^ a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |]]')), [['<sup class="invalid">^ |</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |b]]')), [['<sup class="invalid">^ |b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | ]]')), [['<sup class="invalid">^ |</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | b]]')), [['<sup class="invalid">^ | b</sup>'], '']);
    });

  });

});
