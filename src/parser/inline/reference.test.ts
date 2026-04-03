import { reference } from './reference';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/reference', () => {
  describe('reference', () => {
    const parser = some(reference);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a]b]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[["]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[(]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[[%]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ ]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ a]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ a ]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\\ a]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[<wbr>a]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\na]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\\\na]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\\\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\\\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[*a\nb*]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\\]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a]b]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[[a]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [[a]]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[[a]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a ]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a  ]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a &nbsp;]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a <wbr>]]')), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[ab]]')), [['<sup class="reference"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('[[`a`]]')), [['<sup class="reference"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[@a]]')), [['<sup class="reference"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[http://host]]')), [['<sup class="reference"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]]')), [['<sup class="reference"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a[[]]]]')), [['<sup class="reference"><span>a[[]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[[a]]]')), [['<sup class="reference"><span>[a]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[[[a]]]]')), [['<sup class="reference"><span>[[a]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[((a))]]')), [['<sup class="reference"><span><span class="paren">(<span class="paren">(a)</span>)</span></span></sup>'], '']);
    });

    it('abbr', () => {
      assert.deepStrictEqual(inspect(parser, input('[[^]]')), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A,]]')), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A, ]]')), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A.]]')), [['<sup class="reference" data-abbr="A."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A.,]]')), [['<sup class="reference" data-abbr="A.,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A?]]')), [['<sup class="reference" data-abbr="A?"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A?,]]')), [['<sup class="reference" data-abbr="A?,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A ]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A  ]]')), [['<sup class="invalid"><span>^A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A B]]')), [['<sup class="reference" data-abbr="A B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A  B]]')), [['<sup class="invalid"><span>^A B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A,|]]')), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A |]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b ]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b  ]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A| ]]')), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A| b]]')), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|  ]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[^A|<wbr>]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[^A|<wbr>b]]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[^A|^]]')), [['<sup class="reference" data-abbr="A"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|^B]]')), [['<sup class="reference" data-abbr="A"><span>^B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1]]')), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1A]]')), [['<sup class="invalid"><span>^1A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1 ]]')), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1 A]]')), [['<sup class="invalid"><span>^1 A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1|]]')), [['<sup class="invalid"><span>^1|</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1 |]]')), [['<sup class="invalid"><span>^1 |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Abc]]')), [['<sup class="reference" data-abbr="Abc"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A, B]]')), [['<sup class="reference" data-abbr="A, B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`[[^A's, Aces']]`)), [[`<sup class="reference" data-abbr="A's, Aces'"><span></span></sup>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020]]')), [['<sup class="reference" data-abbr="Xyz 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, 2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, 2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1.1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1.1-2.1b]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1-2.1b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1.1a-b]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1a-b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1-2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1:1-2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1:1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1n]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1n"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1n1]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1n1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1nn1-2]]')), [['<sup class="reference" data-abbr="Xyz 2020, 1nn1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, i]]')), [['<sup class="reference" data-abbr="Xyz 2020, i"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, capter 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, capter 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, cap. 1]]')), [['<sup class="reference" data-abbr="Xyz 2020, cap. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020a]]')), [['<sup class="reference" data-abbr="Xyz 2020a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020a, 1]]')), [['<sup class="reference" data-abbr="Xyz 2020a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020-2021a]]')), [['<sup class="reference" data-abbr="Xyz 2020-2021a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020-2021a, 1]]')), [['<sup class="reference" data-abbr="Xyz 2020-2021a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz, April 1, 2020]]')), [['<sup class="reference" data-abbr="Xyz, April 1, 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz, April 1, 2020, 1]]')), [['<sup class="reference" data-abbr="Xyz, April 1, 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz n.d.]]')), [['<sup class="reference" data-abbr="Xyz n.d."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz n.d., 1]]')), [['<sup class="reference" data-abbr="Xyz n.d., 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^X. Y., and Z et al. 2020, 1-2]]')), [['<sup class="reference" data-abbr="X. Y., and Z et al. 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^^]]')), [['<sup class="invalid"><span>^^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[\\^]]')), [['<sup class="reference"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ ]]')), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ A]]')), [['<sup class="invalid"><span>^ A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ |]]')), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ |b]]')), [['<sup class="invalid"><span>^ |b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ | ]]')), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ | b]]')), [['<sup class="invalid"><span>^ | b</span></sup>'], '']);
    });

  });

});
