import { loop } from '../../parser/loop';
import { ulist } from './ulist';
import { inspect } from '../debug.test';

describe('Unit: syntax/ulist', () => {
  describe('ulist', () => {
    it('invalid', () => {
      const parser = loop(ulist);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('--')), void 0);
      assert.deepStrictEqual(inspect(parser('-0')), void 0);
      assert.deepStrictEqual(inspect(parser('-a')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n*')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n0')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n -\n0')), void 0);
      assert.deepStrictEqual(inspect(parser(' -')), void 0);
    });

    it('single', () => {
      const parser = loop(ulist);
      assert.deepStrictEqual(inspect(parser('-')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- ')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -')), [['<ul><li>-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -\n')), [['<ul><li>-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('-\n')), [['<ul><li></li></ul>'], '']);
    });

    it('multiple', () => {
      const parser = loop(ulist);
      assert.deepStrictEqual(inspect(parser('-\n-')), [['<ul><li></li><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2')), [['<ul><li>1</li><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2\n- 3')), [['<ul><li>1</li><li>2</li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n\n- 2')), [['<ul><li>1</li></ul>', '<ul><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n\n\n- 2')), [['<ul><li>1</li></ul>'], '\n- 2']);
    });

    it('nest', () => {
      const parser = loop(ulist);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2')), [['<ul><li>1<ul><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n - 3')), [['<ul><li>1<ul><li>2</li><li>3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n- 3')), [['<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- *1*')), [['<ul><li><em>1</em></li></ul>'], '']);
    });

  });

});
