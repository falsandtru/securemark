import { indent } from './indent';

describe('Unit: syntax/indent', () => {
  describe('indent', () => {
    it('valid', () => {
      assert.deepStrictEqual(indent(''), ['', '']);
      assert.deepStrictEqual(indent(' '), ['', '']);
      assert.deepStrictEqual(indent('  '), ['', '']);
      assert.deepStrictEqual(indent('a '), ['', 'a ']);
      assert.deepStrictEqual(indent(' a '), ['a ', '']);
      assert.deepStrictEqual(indent('  a '), ['a ', '']);
      assert.deepStrictEqual(indent(' a\n a'), ['a\na', '']);
      assert.deepStrictEqual(indent(' a\n  a'), ['a\n a', '']);
      assert.deepStrictEqual(indent('  a\n a'), ['a', ' a']);
    });

  });

});
