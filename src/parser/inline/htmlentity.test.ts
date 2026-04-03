import { htmlentity } from './htmlentity';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/htmlentity', () => {
  describe('htmlentity', () => {
    const parser = some(htmlentity);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('&')), [['&'], '']);
      assert.deepStrictEqual(inspect(parser, input('&amp')), [['&amp'], '']);
      assert.deepStrictEqual(inspect(parser, input('&;')), [['&'], ';']);
      assert.deepStrictEqual(inspect(parser, input('& ;')), [['&'], ' ;']);
      assert.deepStrictEqual(inspect(parser, input('&\n;')), [['&'], '\n;']);
      assert.deepStrictEqual(inspect(parser, input('&a;')), [['<span class="invalid">&amp;a;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('&#;')), [['&'], '#;']);
      assert.deepStrictEqual(inspect(parser, input('&#g;')), [['&'], '#g;']);
      assert.deepStrictEqual(inspect(parser, input('&#x;')), [['&'], '#x;']);
      assert.deepStrictEqual(inspect(parser, input('&#-1;')), [['&'], '#-1;']);
      assert.deepStrictEqual(inspect(parser, input('&&amp;;')), [['&', '&'], ';']);
      assert.deepStrictEqual(inspect(parser, input('&*&amp*')), [['&'], '*&amp*']);
      assert.deepStrictEqual(inspect(parser, input('&<;')), [['&'], '<;']);
      assert.deepStrictEqual(inspect(parser, input('&<>;')), [['&'], '<>;']);
      assert.deepStrictEqual(inspect(parser, input('&>;')), [['&'], '>;']);
      assert.deepStrictEqual(inspect(parser, input('&#35;')), [['&'], '#35;']);
      assert.deepStrictEqual(inspect(parser, input('&#1234;')), [['&'], '#1234;']);
      assert.deepStrictEqual(inspect(parser, input('&#992;')), [['&'], '#992;']);
      assert.deepStrictEqual(inspect(parser, input('&#98765432;')), [['&'], '#98765432;']);
      assert.deepStrictEqual(inspect(parser, input('&#0;')), [['&'], '#0;']);
      assert.deepStrictEqual(inspect(parser, input('&#X22;')), [['&'], '#X22;']);
      assert.deepStrictEqual(inspect(parser, input('&#XD06;')), [['&'], '#XD06;']);
      assert.deepStrictEqual(inspect(parser, input('&#xcab;')), [['&'], '#xcab;']);
      assert.deepStrictEqual(inspect(parser, input('&NewLine;')), [['<span class="invalid">&amp;NewLine;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' &amp;')), undefined);
    });

    it('entity', () => {
      assert.deepStrictEqual(inspect(parser, input('&nbsp;')), [['\u00A0'], '']);
      assert.deepStrictEqual(inspect(parser, input('&amp;')), [['&'], '']);
      assert.deepStrictEqual(inspect(parser, input('&copy;')), [['©'], '']);
      assert.deepStrictEqual(inspect(parser, input('&AElig;')), [['Æ'], '']);
      assert.deepStrictEqual(inspect(parser, input('&Dcaron;')), [['Ď'], '']);
      assert.deepStrictEqual(inspect(parser, input('&frac34;')), [['¾'], '']);
      assert.deepStrictEqual(inspect(parser, input('&HilbertSpace;')), [['ℋ'], '']);
      assert.deepStrictEqual(inspect(parser, input('&DifferentialD;')), [['ⅆ'], '']);
      assert.deepStrictEqual(inspect(parser, input('&ClockwiseContourIntegral;')), [['∲'], '']);
      assert.deepStrictEqual(inspect(parser, input('&ngE;')), [['≧̸'], '']);
    });

  });

});
