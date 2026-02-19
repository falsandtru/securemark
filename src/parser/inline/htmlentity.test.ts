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
      assert.deepStrictEqual(inspect(parser('&'), ctx), [['&'], '']);
      assert.deepStrictEqual(inspect(parser('&amp'), ctx), [['&amp'], '']);
      assert.deepStrictEqual(inspect(parser('&;'), ctx), [['&'], ';']);
      assert.deepStrictEqual(inspect(parser('& ;'), ctx), [['&'], ' ;']);
      assert.deepStrictEqual(inspect(parser('&\n;'), ctx), [['&'], '\n;']);
      assert.deepStrictEqual(inspect(parser('&a;'), ctx), [['<span class="invalid">&amp;a;</span>'], '']);
      assert.deepStrictEqual(inspect(parser('&#;'), ctx), [['&'], '#;']);
      assert.deepStrictEqual(inspect(parser('&#g;'), ctx), [['&'], '#g;']);
      assert.deepStrictEqual(inspect(parser('&#x;'), ctx), [['&'], '#x;']);
      assert.deepStrictEqual(inspect(parser('&#-1;'), ctx), [['&'], '#-1;']);
      assert.deepStrictEqual(inspect(parser('&&amp;;'), ctx), [['&', '&'], ';']);
      assert.deepStrictEqual(inspect(parser('&*&amp*'), ctx), [['&'], '*&amp*']);
      assert.deepStrictEqual(inspect(parser('&<;'), ctx), [['&'], '<;']);
      assert.deepStrictEqual(inspect(parser('&<>;'), ctx), [['&'], '<>;']);
      assert.deepStrictEqual(inspect(parser('&>;'), ctx), [['&'], '>;']);
      assert.deepStrictEqual(inspect(parser('&#35;'), ctx), [['&'], '#35;']);
      assert.deepStrictEqual(inspect(parser('&#1234;'), ctx), [['&'], '#1234;']);
      assert.deepStrictEqual(inspect(parser('&#992;'), ctx), [['&'], '#992;']);
      assert.deepStrictEqual(inspect(parser('&#98765432;'), ctx), [['&'], '#98765432;']);
      assert.deepStrictEqual(inspect(parser('&#0;'), ctx), [['&'], '#0;']);
      assert.deepStrictEqual(inspect(parser('&#X22;'), ctx), [['&'], '#X22;']);
      assert.deepStrictEqual(inspect(parser('&#XD06;'), ctx), [['&'], '#XD06;']);
      assert.deepStrictEqual(inspect(parser('&#xcab;'), ctx), [['&'], '#xcab;']);
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
