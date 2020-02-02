import { ulist } from './ulist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ulist', () => {
  describe('ulist', () => {
    const parser = (source: string) => some(ulist)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('-')), undefined);
      assert.deepStrictEqual(inspect(parser('--')), undefined);
      assert.deepStrictEqual(inspect(parser('-0')), undefined);
      assert.deepStrictEqual(inspect(parser('-a')), undefined);
      assert.deepStrictEqual(inspect(parser('-[]')), undefined);
      assert.deepStrictEqual(inspect(parser('-[ ]')), undefined);
      assert.deepStrictEqual(inspect(parser('-[x]')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n+')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n0')), undefined);
      assert.deepStrictEqual(inspect(parser('-\n -\n 0')), undefined);
      assert.deepStrictEqual(inspect(parser('- 0\n  - 0\n - 0')), undefined);
      assert.deepStrictEqual(inspect(parser('- !http://host')), [['<ul><li>!<a href="http://host" rel="noopener" target="_blank">http://host</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser(' -')), undefined);
      assert.deepStrictEqual(inspect(parser('+')), undefined);
      assert.deepStrictEqual(inspect(parser('*')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('- ')), [['<ul><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('- \\')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- \\\n')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -')), [['<ul><li>-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -\n')), [['<ul><li>-</li></ul>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('-\n-')), [['<ul><li></li><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('- 1\n- 2')), [['<ul><li>1</li><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2\n- 3')), [['<ul><li>1</li><li>2</li><li>3</li></ul>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('-\n -')), [['<ul><li><br><ul><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2')), [['<ul><li>1<ul><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n - 3')), [['<ul><li>1<ul><li>2</li><li>3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n  - 3')), [['<ul><li>1<ul><li>2<ul><li>3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n- 3')), [['<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n + 2')), [['<ul><li>1<ul class="invalid" data-invalid-syntax="list" data-invalid-message="Use - instead of + or *"><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0')), [['<ul><li>1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0.')), [['<ul><li>1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0. ')), [['<ul><li>1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0. 2')), [['<ul><li>1<ol><li>2</li></ol></li></ul>'], '']);
    });

  });

});
