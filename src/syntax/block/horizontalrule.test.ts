import { loop } from '../../parser/loop';
import { horizontalrule } from './horizontalrule';
import { inspect } from '../debug.test';

describe('Unit: syntax/horizontalrule', () => {
  describe('newline', () => {
    it('invalid', () => {
      const parser = loop(horizontalrule);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('-')), void 0);
      assert.deepStrictEqual(inspect(parser('--')), void 0);
      assert.deepStrictEqual(inspect(parser('--\n-')), void 0);
      assert.deepStrictEqual(inspect(parser('---\na')), void 0);
      assert.deepStrictEqual(inspect(parser('***')), void 0);
    });

    it('valid', () => {
      const parser = loop(horizontalrule);
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
