import { body } from './body';

describe('Unit: parser/api/body', () => {
  describe('body', () => {
    it('', () => {
      assert.deepStrictEqual(body(''), '');
      assert.deepStrictEqual(body('---'), '---');
      assert.deepStrictEqual(body('---\na: b\n'), '---\na: b\n');
      assert.deepStrictEqual(body('---\na: b\n---'), '');
      assert.deepStrictEqual(body('---\na: b\n---\n'), '');
      assert.deepStrictEqual(body('---\na: b\n---\n\n'), '');
      assert.deepStrictEqual(body('---\na: b\n---\n\n\n'), '\n');
      assert.deepStrictEqual(body('---\na: b\n---\n\n\na'), '\na');
    });

  });

});

