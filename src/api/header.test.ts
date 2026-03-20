import { headers } from './header';

describe('Unit: api/header', () => {
  describe('headers', () => {
    it('basic', () => {
      assert.deepStrictEqual(headers(''), []);
      assert.deepStrictEqual(headers('---'), []);
      assert.deepStrictEqual(headers('---\n'), []);
      assert.deepStrictEqual(headers('---\n---'), []);
      assert.deepStrictEqual(headers('---\n---\n'), []);
      assert.deepStrictEqual(headers('---\na: b\n'), []);
      assert.deepStrictEqual(headers('---\na: b\n---c'), []);
      assert.deepStrictEqual(headers('---\na: b\n---\nc'), []);
      assert.deepStrictEqual(headers('---\n\n---'), []);
      assert.deepStrictEqual(headers('---\n \n---'), []);
      assert.deepStrictEqual(headers('---\n-\n---'), []);
      assert.deepStrictEqual(headers('---\na: b\n---'), ['a: b']);
      assert.deepStrictEqual(headers('---\na: b\nC: D e\n---\n'), ['a: b', 'C: D e']);
    });

  });

});
