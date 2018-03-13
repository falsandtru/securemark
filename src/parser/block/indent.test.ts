import { indent } from './indent';

describe('Unit: parser/block/indent', () => {
  describe('indent', () => {
    it('valid', () => {
      assert.deepStrictEqual(indent(''), undefined);
      assert.deepStrictEqual(indent(' '), undefined);
      assert.deepStrictEqual(indent('  '), undefined);
      assert.deepStrictEqual(indent('a '), undefined);
      assert.deepStrictEqual(indent(' a '), ['a ', '']);
      assert.deepStrictEqual(indent('  a '), ['a ', '']);
      assert.deepStrictEqual(indent(' a\n a'), ['a\na', '']);
      assert.deepStrictEqual(indent(' a\n  a'), ['a\n a', '']);
      assert.deepStrictEqual(indent('  a\n a'), ['a', ' a']);
    });

  });

});
