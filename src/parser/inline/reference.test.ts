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
      assert.deepStrictEqual(inspect(parser('[["]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[(]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[<bdi>]]')), undefined);
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
      assert.deepStrictEqual(inspect(parser('[[http://host]]')), [['<sup class="reference"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]]')), [['<sup class="reference"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]')), [['<sup class="reference"><span>[a]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), [['<sup class="reference"><span>[[a]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[((a))]]')), [['<sup class="reference"><span><span class="paren">((a))</span></span></sup>'], '']);
    });

    it('abbr', () => {
      assert.deepStrictEqual(inspect(parser('[[^]]')), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A,]]')), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A, ]]')), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A.]]')), [['<sup class="reference" data-abbr="A."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A.,]]')), [['<sup class="reference" data-abbr="A.,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A?]]')), [['<sup class="reference" data-abbr="A?"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A?,]]')), [['<sup class="reference" data-abbr="A?,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A ]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A  ]]')), [['<sup class="invalid"><span>^A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A B]]')), [['<sup class="reference" data-abbr="A B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A  B]]')), [['<sup class="invalid"><span>^A  B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A,|]]')), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A |]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b ]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b  ]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|<wbr>]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|<wbr>b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A| ]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A| b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|  ]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|^]]')), [['<sup class="reference" data-abbr="A"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|^B]]')), [['<sup class="reference" data-abbr="A"><span>^B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1]]')), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1A]]')), [['<sup class="invalid"><span>^1A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 ]]')), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 A]]')), [['<sup class="invalid"><span>^1 A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1|]]')), [['<sup class="invalid"><span>^1|</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 |]]')), [['<sup class="invalid"><span>^1 |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Abc]]')), [['<sup class="reference" data-abbr="Abc"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A, B]]')), [['<sup class="reference" data-abbr="A, B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser(`[[^A's, Aces']]`)), [[`<sup class="reference" data-abbr="A's, Aces'"><span></span></sup>`], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020]]')), [['<sup class="reference" data-abbr="Xyz 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, 2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, 2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1.1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1.1-2.1b]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1-2.1b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1.1a-b]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1a-b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1-2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1:1-2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1:1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1n]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1n"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1n1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1n1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1nn1-2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1nn1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, i]]')), [['<sup class="reference" data-abbr="Xyz 2020, i"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, capter 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, capter 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, cap. 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, cap. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020a]]')), [['<sup class="reference" data-abbr="Xyz 2020a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020a, 1]]')), [['<sup class="reference" data-abbr="Xyz 2020a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020-2021a]]')), [['<sup class="reference" data-abbr="Xyz 2020-2021a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020-2021a, 1]]')), [['<sup class="reference" data-abbr="Xyz 2020-2021a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz, April 1, 2020]]')), [['<sup class="reference" data-abbr="Xyz, April 1, 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz, April 1, 2020, 1]]')), [['<sup class="reference" data-abbr="Xyz, April 1, 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz n.d.]]')), [['<sup class="reference" data-abbr="Xyz n.d."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz n.d., 1]]')), [['<sup class="reference" data-abbr="Xyz n.d., 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^X. Y., and Z et al. 2020, 1-2]]')), [['<sup class="reference" data-abbr="X. Y., and Z et al. 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^^]]')), [['<sup class="invalid"><span>^^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\^]]')), [['<sup class="reference"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ ]]')), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ A]]')), [['<sup class="invalid"><span>^ A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |]]')), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |b]]')), [['<sup class="invalid"><span>^ |b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | ]]')), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | b]]')), [['<sup class="invalid"><span>^ | b</span></sup>'], '']);
    });

  });

});
