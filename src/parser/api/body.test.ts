import { body } from './body';

describe('Unit: parser/api/body', () => {
  describe('body', () => {
    it('', () => {
      assert.deepStrictEqual(body(''), '');
      assert.deepStrictEqual(body('---'), '---');
      assert.deepStrictEqual(body('---\n'), '---\n');
      assert.deepStrictEqual(body('---\n---'), '');
      assert.deepStrictEqual(body('---\n---\n'), '');
      assert.deepStrictEqual(body('---\n---\n\n'), '');
      assert.deepStrictEqual(body('---\n---\n\n\n'), '\n');
      assert.deepStrictEqual(body('---\n---\n\n\na'), '\na');
    });

  });

});

