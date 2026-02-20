import { reference } from './reference';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/reference', () => {
  describe('reference', () => {
    const parser = (source: string) => some(reference)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('['), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[['), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[["]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[(]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[<bdi>]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[ ]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[ [a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[\n]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[\na]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\\na]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\n]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\n]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\nb]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\nb]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[*a\nb*]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[a]b]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[[a]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [[a]]'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[[ a]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ a ]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\ a]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<wbr>a]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a ]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a  ]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a &nbsp;]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a <wbr>]]'), ctx), [['<sup class="reference"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ab]]'), ctx), [['<sup class="reference"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[[`a`]]'), ctx), [['<sup class="reference"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[@a]]'), ctx), [['<sup class="reference"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[http://host]]'), ctx), [['<sup class="reference"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]]'), ctx), [['<sup class="reference"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]'), ctx), [['<sup class="reference"><span>[a]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]'), ctx), [['<sup class="reference"><span>[[a]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[((a))]]'), ctx), [['<sup class="reference"><span><span class="paren">((a))</span></span></sup>'], '']);
    });

    it('abbr', () => {
      assert.deepStrictEqual(inspect(parser('[[^]]'), ctx), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A]]'), ctx), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A,]]'), ctx), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A, ]]'), ctx), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A.]]'), ctx), [['<sup class="reference" data-abbr="A."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A.,]]'), ctx), [['<sup class="reference" data-abbr="A.,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A?]]'), ctx), [['<sup class="reference" data-abbr="A?"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A?,]]'), ctx), [['<sup class="reference" data-abbr="A?,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A ]]'), ctx), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A  ]]'), ctx), [['<sup class="invalid"><span>^A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A B]]'), ctx), [['<sup class="reference" data-abbr="A B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A  B]]'), ctx), [['<sup class="invalid"><span>^A  B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|]]'), ctx), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A,|]]'), ctx), [['<sup class="reference" data-abbr="A,"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A |]]'), ctx), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b]]'), ctx), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b]]'), ctx), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b ]]'), ctx), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|b  ]]'), ctx), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A| ]]'), ctx), [['<sup class="reference" data-abbr="A"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A| b]]'), ctx), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|  ]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[^A|<wbr>]]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[[^A|<wbr>b]]'), ctx), [['<sup class="reference" data-abbr="A"><span>b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|^]]'), ctx), [['<sup class="reference" data-abbr="A"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A|^B]]'), ctx), [['<sup class="reference" data-abbr="A"><span>^B</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1]]'), ctx), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1A]]'), ctx), [['<sup class="invalid"><span>^1A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 ]]'), ctx), [['<sup class="invalid"><span>^1</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 A]]'), ctx), [['<sup class="invalid"><span>^1 A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1|]]'), ctx), [['<sup class="invalid"><span>^1|</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^1 |]]'), ctx), [['<sup class="invalid"><span>^1 |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Abc]]'), ctx), [['<sup class="reference" data-abbr="Abc"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^A, B]]'), ctx), [['<sup class="reference" data-abbr="A, B"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser(`[[^A's, Aces']]`), ctx), [[`<sup class="reference" data-abbr="A's, Aces'"><span></span></sup>`], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, 2]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1, 2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1.1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1.1-2.1b]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1-2.1b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1, fig. 1.1a-b]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1a-b"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1-2]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1:1-2]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1:1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1n]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1n"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1n1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1n1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, 1nn1-2]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, 1nn1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, i]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, i"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, capter 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, capter 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020, cap. 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020, cap. 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020a]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020a, 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020-2021a]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020-2021a"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz 2020-2021a, 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz 2020-2021a, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz, April 1, 2020]]'), ctx), [['<sup class="reference" data-abbr="Xyz, April 1, 2020"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz, April 1, 2020, 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz, April 1, 2020, 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz n.d.]]'), ctx), [['<sup class="reference" data-abbr="Xyz n.d."><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^Xyz n.d., 1]]'), ctx), [['<sup class="reference" data-abbr="Xyz n.d., 1"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^X. Y., and Z et al. 2020, 1-2]]'), ctx), [['<sup class="reference" data-abbr="X. Y., and Z et al. 2020, 1-2"><span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^^]]'), ctx), [['<sup class="invalid"><span>^^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[\\^]]'), ctx), [['<sup class="reference"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ ]]'), ctx), [['<sup class="invalid"><span>^</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ A]]'), ctx), [['<sup class="invalid"><span>^ A</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |]]'), ctx), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ |b]]'), ctx), [['<sup class="invalid"><span>^ |b</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | ]]'), ctx), [['<sup class="invalid"><span>^ |</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[^ | b]]'), ctx), [['<sup class="invalid"><span>^ | b</span></sup>'], '']);
    });

  });

});
