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
      // invalid
      assert.deepStrictEqual(inspect(parser('-\n+')), [['<ul><li></li><li><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('-\n0')), [['<ul><li></li><li><span class="invalid">0</span></li></ul>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('-\n -')), [['<ul><li><br><ul><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2')), [['<ul><li>1<ul><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n- 3')), [['<ul><li>1<ul><li>2</li></ul></li><li>3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n - 3')), [['<ul><li>1<ul><li>2</li><li>3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n  - 3')), [['<ul><li>1<ul><li>2<ul><li>3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n  - 2\n - 3')), [['<ul><li>1<ul><li>2</li></ul></li><li><span class="invalid"> - 3</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('-\n -\n +\n -\n +\n+')), [['<ul><li><br><ul><li></li><li><span class="invalid">+</span></li><li></li><li><span class="invalid">+</span></li></ul></li><li><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n + 2')), [['<ul><li>1<ul class="invalid"><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0')), [['<ul><li>1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0.')), [['<ul><li>1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0. ')), [['<ul><li>1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0. 2')), [['<ul><li>1<ol><li>2</li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- !http://host')), [['<ul><li>!<a href="http://host" target="_blank">http://host</a></li></ul>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser('- [ ]')), [['<ul class="checklist"><li><span class="checkbox">☐</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [x]')), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [X]')), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [X] 1')), [['<ul class="checklist"><li><span class="checkbox">☑</span>1</li></ul>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('- [#a]')), [['<ul><li><a class="index" href="#index:a">a</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [#b]')), [['<ul><li id="index:b">a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ] [#a]')), [['<ul class="checklist"><li><span class="checkbox">☐</span><a class="index" href="#index:a">a</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ] a [#b]')), [['<ul class="checklist"><li id="index:b"><span class="checkbox">☐</span>a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [#b]\n - c [#d]')), [['<ul><li id="index:b">a<span class="indexer" data-index="b"></span><ul><li id="index:d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
    });

  });

});
