import { trim } from './trim';
import { input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/trim', () => {
  describe('trim', () => {
    it('', () => {
      const parser = trim(({ source }) => [[source], '']);
      assert.deepStrictEqual(inspect(parser(input('', {}))), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input('a\n', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input('a ', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input('a \n', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a ', {}))), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a \n b \n', {}))), [['a \n b'], '']);
    });

  });

});
