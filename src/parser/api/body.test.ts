import { body } from './body';

describe('Unit: parser/api/body', () => {
  describe('body', () => {
    it('', () => {
      assert.deepStrictEqual(body(''), '');
      assert.deepStrictEqual(body('---'), '---');
      assert.deepStrictEqual(body('---\na\n'), '---\na\n');
      assert.deepStrictEqual(body('---\na\n---'), '');
      assert.deepStrictEqual(body('---\na\n---\n'), '');
      assert.deepStrictEqual(body('---\na\n---\n\n'), '');
      assert.deepStrictEqual(body('---\na\n---\n\n\n'), '\n');
      assert.deepStrictEqual(body('---\na\n---\n\n\na'), '\na');
    });

  });

});

