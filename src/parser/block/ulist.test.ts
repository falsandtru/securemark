import { loop } from '../../combinator/loop';
import { ulist } from './ulist';
import { inspect } from '../debug.test';

describe('Unit: parser/ulist', () => {
  describe('ulist', () => {
    const parser = loop(ulist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('--')), void 0);
      assert.deepStrictEqual(inspect(parser('-0')), void 0);
      assert.deepStrictEqual(inspect(parser('-a')), void 0);
      assert.deepStrictEqual(inspect(parser('-[]')), void 0);
      assert.deepStrictEqual(inspect(parser('-[ ]')), void 0);
      assert.deepStrictEqual(inspect(parser('-[x]')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n*')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n0')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n -\n0')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n  -\n -')), void 0);
      assert.deepStrictEqual(inspect(parser(' -')), void 0);
      assert.deepStrictEqual(inspect(parser('-\n+')), void 0);
    });

    it('single', () => {
      assert.deepStrictEqual(inspect(parser('-')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- ')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -')), [['<ul><li>-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -\n')), [['<ul><li>-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('-\n')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('+')), [['<ul><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('*')), [['<ul><li></li></ul>'], '']);
    });

    it('multiple', () => {
      assert.deepStrictEqual(inspect(parser('-\n-')), [['<ul><li></li><li></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2')), [['<ul><li>1</li><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2\n- 3')), [['<ul><li>1</li><li>2</li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n\n- 2')), [['<ul><li>1</li></ul>', '<ul><li>2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n\n\n- 2')), [['<ul><li>1</li></ul>'], '\n- 2']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('- 1\n - 2')), [['<ul><li>1<ul><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n - 3')), [['<ul><li>1<ul><li>2</li><li>3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n  - 3')), [['<ul><li>1<ul><li>2<ul><li>3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n- 3')), [['<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- *1*')), [['<ul><li><em>1</em></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n + 2')), [['<ul><li>1<ul><li>2</li></ul></li></ul>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser('- []')), [['<ul><li>[]</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [X]')), [['<ul><li>[X]</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ]')), [['<ul><li><span class="checkbox">[ ] </span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [x]')), [['<ul><li><span class="checkbox">[x] </span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ] 1')), [['<ul><li><span class="checkbox">[ ] </span>1</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ]  1')), [['<ul><li><span class="checkbox">[ ] </span>1</li></ul>'], '']);
    });

  });

});
