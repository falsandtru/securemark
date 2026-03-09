import { htmlentity } from './htmlentity';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/htmlentity', () => {
  describe('htmlentity', () => {
    const parser = some(htmlentity);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('&', new Context())), [['&'], '']);
      assert.deepStrictEqual(inspect(parser, input('&amp', new Context())), [['&amp'], '']);
      assert.deepStrictEqual(inspect(parser, input('&;', new Context())), [['&'], ';']);
      assert.deepStrictEqual(inspect(parser, input('& ;', new Context())), [['&'], ' ;']);
      assert.deepStrictEqual(inspect(parser, input('&\n;', new Context())), [['&'], '\n;']);
      assert.deepStrictEqual(inspect(parser, input('&a;', new Context())), [['<span class="invalid">&amp;a;</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('&#;', new Context())), [['&'], '#;']);
      assert.deepStrictEqual(inspect(parser, input('&#g;', new Context())), [['&'], '#g;']);
      assert.deepStrictEqual(inspect(parser, input('&#x;', new Context())), [['&'], '#x;']);
      assert.deepStrictEqual(inspect(parser, input('&#-1;', new Context())), [['&'], '#-1;']);
      assert.deepStrictEqual(inspect(parser, input('&&amp;;', new Context())), [['&', '&'], ';']);
      assert.deepStrictEqual(inspect(parser, input('&*&amp*', new Context())), [['&'], '*&amp*']);
      assert.deepStrictEqual(inspect(parser, input('&<;', new Context())), [['&'], '<;']);
      assert.deepStrictEqual(inspect(parser, input('&<>;', new Context())), [['&'], '<>;']);
      assert.deepStrictEqual(inspect(parser, input('&>;', new Context())), [['&'], '>;']);
      assert.deepStrictEqual(inspect(parser, input('&#35;', new Context())), [['&'], '#35;']);
      assert.deepStrictEqual(inspect(parser, input('&#1234;', new Context())), [['&'], '#1234;']);
      assert.deepStrictEqual(inspect(parser, input('&#992;', new Context())), [['&'], '#992;']);
      assert.deepStrictEqual(inspect(parser, input('&#98765432;', new Context())), [['&'], '#98765432;']);
      assert.deepStrictEqual(inspect(parser, input('&#0;', new Context())), [['&'], '#0;']);
      assert.deepStrictEqual(inspect(parser, input('&#X22;', new Context())), [['&'], '#X22;']);
      assert.deepStrictEqual(inspect(parser, input('&#XD06;', new Context())), [['&'], '#XD06;']);
      assert.deepStrictEqual(inspect(parser, input('&#xcab;', new Context())), [['&'], '#xcab;']);
      assert.deepStrictEqual(inspect(parser, input(' &amp;', new Context())), undefined);
    });

    it('entity', () => {
      assert.deepStrictEqual(inspect(parser, input('&NewLine;', new Context())), [[' '], '']);
      assert.deepStrictEqual(inspect(parser, input('&nbsp;', new Context())), [['\u00A0'], '']);
      assert.deepStrictEqual(inspect(parser, input('&amp;', new Context())), [['&'], '']);
      assert.deepStrictEqual(inspect(parser, input('&copy;', new Context())), [['©'], '']);
      assert.deepStrictEqual(inspect(parser, input('&AElig;', new Context())), [['Æ'], '']);
      assert.deepStrictEqual(inspect(parser, input('&Dcaron;', new Context())), [['Ď'], '']);
      assert.deepStrictEqual(inspect(parser, input('&frac34;', new Context())), [['¾'], '']);
      assert.deepStrictEqual(inspect(parser, input('&HilbertSpace;', new Context())), [['ℋ'], '']);
      assert.deepStrictEqual(inspect(parser, input('&DifferentialD;', new Context())), [['ⅆ'], '']);
      assert.deepStrictEqual(inspect(parser, input('&ClockwiseContourIntegral;', new Context())), [['∲'], '']);
      assert.deepStrictEqual(inspect(parser, input('&ngE;', new Context())), [['≧̸'], '']);
    });

  });

});
