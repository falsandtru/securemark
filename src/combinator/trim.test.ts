import { trim, trimLine } from './trim';
import { inspect } from '../debug.test';

describe('Unit: combinator/trim', () => {
  describe('trim', () => {
    it('', () => {
      const parser = trim(s => [[s], '']);
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a \n b \n')), [['a \n b'], '']);
    });

  });

  describe('trimLine', () => {
    it('', () => {
      const parser = trimLine(s => [[s], '']);
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['a\n'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['a\n'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a ')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(' a \n b \n')), [['a\n b \n'], '']);
    });

  });

});
