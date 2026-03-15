import { reference } from './reference';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/reference', () => {
  describe('reference', () => {
    const parser = some(reference);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[]]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[["]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[(]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[[%]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ ]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ a]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[ a ]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\\ a]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[<wbr>a]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\n]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\na]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\\\na]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\n]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\\\n]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\nb]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a\\\nb]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[*a\nb*]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[\\]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[a]b]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[[a]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [[a]]', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('[[a]]', new Context())), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a ]]', new Context())), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a  ]]', new Context())), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a &nbsp;]]', new Context())), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[a <wbr>]]', new Context())), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[ab]]', new Context())), [['<sup class="reference"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('[[`a`]]', new Context())), [['<sup class="reference"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[@a]]', new Context())), [['<sup class="reference"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[http://host]]', new Context())), [['<sup class="reference"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[![]{a}]]', new Context())), [['<sup class="reference"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[[a]]]', new Context())), [['<sup class="reference"><span>[a]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[[[a]]]]', new Context())), [['<sup class="reference"><span>[[a]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[((a))]]', new Context())), [['<sup class="reference"><span><span class="bracket">((a))</span></span></sup>'], '']);
    });

    it('abbr', () => {
      assert.deepStrictEqual(inspect(parser, input('[[^]]', new Context())), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A]]', new Context())), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A,]]', new Context())), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A, ]]', new Context())), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A.]]', new Context())), [['<sup class="reference" data-abbr="A."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A.,]]', new Context())), [['<sup class="reference" data-abbr="A.,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A?]]', new Context())), [['<sup class="reference" data-abbr="A?"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A?,]]', new Context())), [['<sup class="reference" data-abbr="A?,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A ]]', new Context())), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A  ]]', new Context())), [['<sup class="invalid"><span>^A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A B]]', new Context())), [['<sup class="reference" data-abbr="A B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A  B]]', new Context())), [['<sup class="invalid"><span>^A B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|]]', new Context())), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A,|]]', new Context())), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A |]]', new Context())), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b]]', new Context())), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b]]', new Context())), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b ]]', new Context())), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|b  ]]', new Context())), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A| ]]', new Context())), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A| b]]', new Context())), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|  ]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[^A|<wbr>]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[^A|<wbr>b]]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[[^A|^]]', new Context())), [['<sup class="reference" data-abbr="A"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A|^B]]', new Context())), [['<sup class="reference" data-abbr="A"><span>^B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1]]', new Context())), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1A]]', new Context())), [['<sup class="invalid"><span>^1A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1 ]]', new Context())), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1 A]]', new Context())), [['<sup class="invalid"><span>^1 A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1|]]', new Context())), [['<sup class="invalid"><span>^1|</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^1 |]]', new Context())), [['<sup class="invalid"><span>^1 |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Abc]]', new Context())), [['<sup class="reference" data-abbr="Abc"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^A, B]]', new Context())), [['<sup class="reference" data-abbr="A, B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`[[^A's, Aces']]`, new Context())), [[`<sup class="reference" data-abbr="A's, Aces'"><span></span></sup>`], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, 2]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1, 2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1.1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1.1-2.1b]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1-2.1b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1, fig. 1.1a-b]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1a-b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1-2]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1:1-2]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1:1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1n]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1n"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1n1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1n1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, 1nn1-2]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, 1nn1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, i]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, i"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, capter 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, capter 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020, cap. 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020, cap. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020a]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020a, 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020-2021a]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020-2021a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz 2020-2021a, 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz 2020-2021a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz, April 1, 2020]]', new Context())), [['<sup class="reference" data-abbr="Xyz, April 1, 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz, April 1, 2020, 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz, April 1, 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz n.d.]]', new Context())), [['<sup class="reference" data-abbr="Xyz n.d."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^Xyz n.d., 1]]', new Context())), [['<sup class="reference" data-abbr="Xyz n.d., 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^X. Y., and Z et al. 2020, 1-2]]', new Context())), [['<sup class="reference" data-abbr="X. Y., and Z et al. 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^^]]', new Context())), [['<sup class="invalid"><span>^^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[\\^]]', new Context())), [['<sup class="reference"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ ]]', new Context())), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ A]]', new Context())), [['<sup class="invalid"><span>^ A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ |]]', new Context())), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ |b]]', new Context())), [['<sup class="invalid"><span>^ |b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ | ]]', new Context())), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[[^ | b]]', new Context())), [['<sup class="invalid"><span>^ | b</span></sup>'], '']);
    });

  });

});
