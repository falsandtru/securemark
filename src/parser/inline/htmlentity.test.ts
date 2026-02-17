import { htmlentity } from './htmlentity';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/htmlentity', () => {
  describe('htmlentity', () => {
    const parser = (source: string) => some(htmlentity)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&amp'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('& ;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&\n;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&a;'), ctx), [['<span class="invalid">&amp;a;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('&#;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#g;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#x;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#-1;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&&amp;;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&*&amp*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&<;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&<>;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&>;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#35;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#1234;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#992;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#98765432;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#0;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#X22;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#XD06;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('&#xcab;'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' &amp;'), ctx), undefined);
    });

    it('entity', () => {
      assert.deepStrictEqual(inspect(parser('&NewLine;'), ctx), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('&nbsp;'), ctx), [['\u00A0'], '']);
      assert.deepStrictEqual(inspect(parser('&amp;'), ctx), [['&'], '']);
      assert.deepStrictEqual(inspect(parser('&copy;'), ctx), [['©'], '']);
      assert.deepStrictEqual(inspect(parser('&AElig;'), ctx), [['Æ'], '']);
      assert.deepStrictEqual(inspect(parser('&Dcaron;'), ctx), [['Ď'], '']);
      assert.deepStrictEqual(inspect(parser('&frac34;'), ctx), [['¾'], '']);
      assert.deepStrictEqual(inspect(parser('&HilbertSpace;'), ctx), [['ℋ'], '']);
      assert.deepStrictEqual(inspect(parser('&DifferentialD;'), ctx), [['ⅆ'], '']);
      assert.deepStrictEqual(inspect(parser('&ClockwiseContourIntegral;'), ctx), [['∲'], '']);
      assert.deepStrictEqual(inspect(parser('&ngE;'), ctx), [['≧̸'], '']);
    });

  });

});
