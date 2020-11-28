import { body } from './body';

describe('Unit: parser/api/body', () => {
  describe('body', () => {
    it('basic', () => {
      assert.deepStrictEqual(body(''), '');
      assert.deepStrictEqual(body('---'), '---');
      assert.deepStrictEqual(body('---\na: b\n'), '---\na: b\n');
      assert.deepStrictEqual(body('---\na: b\n---'), '');
      assert.deepStrictEqual(body('---\na: b\n---c'), '---\na: b\n---c');
      assert.deepStrictEqual(body('---\na: b\n---\nc'), '---\na: b\n---\nc');
      assert.deepStrictEqual(body('---\na: b\n---\n'), '');
      assert.deepStrictEqual(body('---\na: b\n---\n\n'), '');
      assert.deepStrictEqual(body('---\na: b\n---\n\n\n'), '\n');
      assert.deepStrictEqual(body('---\na: b\n---\n\n\na'), '\na');
      assert.deepStrictEqual(body('--- \r\na: b \r\n--- \r\n \r\n \r\na'), ' \r\na');
    });

  });

});

