import { loop } from '../../combinator/loop';
import { htmlentity } from './htmlentity';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/htmlentity', () => {
  describe('htmlentity', () => {
    const parser = loop(htmlentity);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('&')), undefined);
      assert.deepStrictEqual(inspect(parser('&amp')), undefined);
      assert.deepStrictEqual(inspect(parser('&;')), undefined);
      assert.deepStrictEqual(inspect(parser('& ;')), undefined);
      assert.deepStrictEqual(inspect(parser('&\n;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#g;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#x;')), undefined);
      assert.deepStrictEqual(inspect(parser('&#-1;')), undefined);
      assert.deepStrictEqual(inspect(parser('&&amp;;')), undefined);
      assert.deepStrictEqual(inspect(parser('&*&amp*')), undefined);
      assert.deepStrictEqual(inspect(parser('&<;')), undefined);
      assert.deepStrictEqual(inspect(parser('&<>;')), undefined);
      assert.deepStrictEqual(inspect(parser('&>;')), undefined);
    });

    it('entity', () => {
      assert.deepStrictEqual(inspect(parser('&nbsp;')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('&amp;')), [['&'], '']);
      assert.deepStrictEqual(inspect(parser('&copy;')), [['©'], '']);
      assert.deepStrictEqual(inspect(parser('&AElig;')), [['Æ'], '']);
      assert.deepStrictEqual(inspect(parser('&Dcaron;')), [['Ď'], '']);
      assert.deepStrictEqual(inspect(parser('&frac34;')), [['¾'], '']);
      assert.deepStrictEqual(inspect(parser('&HilbertSpace;')), [['ℋ'], '']);
      assert.deepStrictEqual(inspect(parser('&DifferentialD;')), [['ⅆ'], '']);
      assert.deepStrictEqual(inspect(parser('&ClockwiseContourIntegral;')), [['∲'], '']);
      assert.deepStrictEqual(inspect(parser('&ngE;')), [['≧̸'], '']);
      assert.deepStrictEqual(inspect(parser('&#35;')), [['#'], '']);
      assert.deepStrictEqual(inspect(parser('&#1234;')), [['Ӓ'], '']);
      assert.deepStrictEqual(inspect(parser('&#992;')), [['Ϡ'], '']);
      assert.deepStrictEqual(inspect(parser('&#98765432;')), [['�'], '']);
      assert.deepStrictEqual(inspect(parser('&#0;')), [['�'], '']);
      assert.deepStrictEqual(inspect(parser('&#X22;')), [['"'], '']);
      assert.deepStrictEqual(inspect(parser('&#XD06;')), [['ആ'], '']);
      assert.deepStrictEqual(inspect(parser('&#xcab;')), [['ಫ'], '']);
    });

  });

});
