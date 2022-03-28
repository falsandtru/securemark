import { htmlentity } from './htmlentity';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/htmlentity', () => {
  describe('htmlentity', () => {
    const parser = (source: string) => some(htmlentity)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('&')), undefined);
      assert.deepStrictEqual(inspect(parser('&amp')), undefined);
      assert.deepStrictEqual(inspect(parser('&;')), undefined);
      assert.deepStrictEqual(inspect(parser('& ;')), undefined);
      assert.deepStrictEqual(inspect(parser('&\n;')), undefined);
      assert.deepStrictEqual(inspect(parser('&a;')), [['<span class="invalid">&amp;a;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('&NewLine;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#g;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#x;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#-1;')), undefined);
      assert.deepStrictEqual(inspect(parser('&&amp;;')), undefined);
      assert.deepStrictEqual(inspect(parser('&*&amp*')), undefined);
      assert.deepStrictEqual(inspect(parser('&<;')), undefined);
      assert.deepStrictEqual(inspect(parser('&<>;')), undefined);
      assert.deepStrictEqual(inspect(parser('&>;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#35;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#1234;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#992;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#98765432;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#0;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#X22;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#XD06;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#xcab;')), undefined);
      assert.deepStrictEqual(inspect(parser(' &amp;')), undefined);
    });

    it('entity', () => {
      assert.deepStrictEqual(inspect(parser('&nbsp;')), [['\u00A0'], '']);
      assert.deepStrictEqual(inspect(parser('&amp;')), [['&'], '']);
      assert.deepStrictEqual(inspect(parser('&copy;')), [['©'], '']);
      assert.deepStrictEqual(inspect(parser('&AElig;')), [['Æ'], '']);
      assert.deepStrictEqual(inspect(parser('&Dcaron;')), [['Ď'], '']);
      assert.deepStrictEqual(inspect(parser('&frac34;')), [['¾'], '']);
      assert.deepStrictEqual(inspect(parser('&HilbertSpace;')), [['ℋ'], '']);
      assert.deepStrictEqual(inspect(parser('&DifferentialD;')), [['ⅆ'], '']);
      assert.deepStrictEqual(inspect(parser('&ClockwiseContourIntegral;')), [['∲'], '']);
      assert.deepStrictEqual(inspect(parser('&ngE;')), [['≧̸'], '']);
    });

  });

});
