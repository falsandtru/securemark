import { loop } from '../../combinator/loop';
import { horizontalrule } from './horizontalrule';
import { inspect } from '../debug.test';

describe('Unit: parser/horizontalrule', () => {
  describe('newline', () => {
    const parser = loop(horizontalrule);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('-')), void 0);
      assert.deepStrictEqual(inspect(parser('--')), void 0);
      assert.deepStrictEqual(inspect(parser('--\n-')), void 0);
      assert.deepStrictEqual(inspect(parser('---\na')), void 0);
      assert.deepStrictEqual(inspect(parser('***')), void 0);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('---')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('---\n')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('---\n\n')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('---\n\n\n')), [['<hr>'], '\n']);
      assert.deepStrictEqual(inspect(parser('  -   - -')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('  -   - - ')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('  -   - - \n')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('----')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('  -   - --')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('  -   - -- ')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('  -   - -- \n')), [['<hr>'], '']);
    });

  });

});
