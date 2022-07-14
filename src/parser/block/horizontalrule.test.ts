import { horizontalrule } from './horizontalrule';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/horizontalrule', () => {
  describe('horizontalrule', () => {
    const parser = (source: string) => some(horizontalrule)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('-')), undefined);
      assert.deepStrictEqual(inspect(parser('--')), undefined);
      assert.deepStrictEqual(inspect(parser('--\n-')), undefined);
      assert.deepStrictEqual(inspect(parser('---a')), undefined);
      assert.deepStrictEqual(inspect(parser('---\na')), undefined);
      assert.deepStrictEqual(inspect(parser('- - -')), undefined);
      assert.deepStrictEqual(inspect(parser(' ---')), undefined);
      assert.deepStrictEqual(inspect(parser('***')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('---')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('--- ')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('---\n')), [['<hr>'], '']);
      assert.deepStrictEqual(inspect(parser('----')), [['<hr>'], '']);
    });

  });

});
