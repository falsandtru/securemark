import { indent } from './indent';
import { input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/indent', () => {
  describe('indent', () => {
    it('valid', () => {
      const parser = indent(({ source }) => [[source], '']);
      assert.deepStrictEqual(inspect(parser(input('', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input(' ', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('  ', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('a ', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input(' a\n', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a ', {}))), [['a '], '']);
      assert.deepStrictEqual(inspect(parser(input(' a \n', {}))), [['a '], '']);
      assert.deepStrictEqual(inspect(parser(input('  a', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a\n a', {}))), [['a\na'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a\n  a', {}))), [['a\n a'], '']);
      assert.deepStrictEqual(inspect(parser(input('  a\n a', {}))), [['a'], ' a']);
      assert.deepStrictEqual(inspect(parser(input(' \ta', {}))), [['\ta'], '']);
      assert.deepStrictEqual(inspect(parser(input('\ta', {}))), [['a'], '']);
    });

  });

});
