import { header } from './header';

describe('Unit: parser/api/header', () => {
  describe('header', () => {
    it('invalid', () => {
      assert.deepStrictEqual(header(''), undefined);
      assert.deepStrictEqual(header('---'), undefined);
      assert.deepStrictEqual(header('---\n'), undefined);
      assert.deepStrictEqual(header('---\na: b\n'), undefined);
      assert.deepStrictEqual(header('---\n \n---'), undefined);
      assert.deepStrictEqual(header('---\n-\n---'), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(header('---\n---'), []);
      assert.deepStrictEqual(header('---\n---\n'), []);
      assert.deepStrictEqual(header('---\na: b\n---'), ['a: b']);
      assert.deepStrictEqual(header('---\na: b\nc: d\n---'), ['a: b', 'c: d']);
      assert.deepStrictEqual(header('---\na: b\nc: d\n---\n'), ['a: b', 'c: d']);
    });

  });

});
