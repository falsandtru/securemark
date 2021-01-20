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
      assert.deepStrictEqual(inspect(parser('[[ a]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ a ]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\na]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\ a]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\\na]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[<wbr>a]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[<# a #>a]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a]b]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[*a\nb*]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[[a]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[^a|  b]]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[[a]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a ]]')), [['<sup class="reference">a </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ab]]')), [['<sup class="reference">ab</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[[`a`]]')), [['<sup class="reference"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[@a]]')), [['<sup class="reference"><a class="account" href="/@a">@a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[http://host]]')), [['<sup class="reference"><a href="http://host" target="_blank">http://host</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]]')), [['<sup class="reference">!<a href="a">a</a></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<a>]]')), [['<sup class="reference">&lt;a&gt;</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]')), [['<sup class="reference">[a]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference">[[a]]</sup>'], '']);
    });

    it('alias', () => {
      assert.deepStrictEqual(inspect(parser('[[^a]]')), [['<sup class="reference" data-alias="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a b]]')), [['<sup class="reference" data-alias="a b"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a  b]]')), [['<sup class="reference">^a  b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|]]')), [['<sup class="reference" data-alias="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b]]')), [['<sup class="reference" data-alias="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a|b ]]')), [['<sup class="reference" data-alias="a">b </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| ]]')), [['<sup class="reference" data-alias="a"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| b]]')), [['<sup class="reference" data-alias="a">b</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^a| b ]]')), [['<sup class="reference" data-alias="a">b </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz2020]]')), [['<sup class="reference" data-alias="Xyz2020"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^X, 2020, p1-2]]')), [['<sup class="reference" data-alias="X, 2020, p1-2"></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^X. Y., Z et al., 2020, p1-2]]')), [['<sup class="reference" data-alias="X. Y., Z et al., 2020, p1-2"></sup>'], '']);
    });

  });

});
