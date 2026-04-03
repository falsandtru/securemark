import { ulist } from './ulist';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ulist', () => {
  describe('ulist', () => {
    const parser = some(ulist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-')), undefined);
      assert.deepStrictEqual(inspect(parser, input('--')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-[]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-[ ]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-[x]')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('-\n- a')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' - ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('+')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*')), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser, input('- ')), [['<ul><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('- \\')), [['<ul><li id="index::\\">\\</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- \\\n')), [['<ul><li id="index::\\">\\</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- -')), [['<ul><li id="index::-">-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- -\n')), [['<ul><li id="index::-">-</li></ul>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser, input('- \n-')), [['<ul><li></li><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('- 1\n- 2')), [['<ul><li id="index::1">1</li><li id="index::2">2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n- 2\n- 3')), [['<ul><li id="index::1">1</li><li id="index::2">2</li><li id="index::3">3</li></ul>'], '']);
      // invalid
      assert.deepStrictEqual(inspect(parser, input('- \n+')), [['<ul><li></li><li id="index::+"><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- \n0')), [['<ul><li></li><li id="index::0"><span class="invalid">0</span></li></ul>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('- \n -')), [['<ul><li><br><ul><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2')), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2\n- 3')), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li><li id="index::3">3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2\n - 3')), [['<ul><li id="index::1">1<ul><li id="index::2">2</li><li id="index::3">3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2\n  - 3')), [['<ul><li id="index::1">1<ul><li id="index::2">2<ul><li id="index::3">3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n  - 2\n - 3')), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li><li id="index::-_3"><span class="invalid"> - 3</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- \n -\n +\n -\n +\n+')), [['<ul><li><br><ul><li></li><li id="index::+"><span class="invalid">+</span></li><li></li><li id="index::+"><span class="invalid">+</span></li></ul></li><li id="index::+"><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n + 2')), [['<ul><li id="index::1">1<ul class="invalid"><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0')), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0.')), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0. ')), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0. 2')), [['<ul><li id="index::1">1<ol><li id="index::2">2</li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [#b]')), [['<ul><li id="index::a_b">a <a class="index" href="#index::b">b</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- http://host\\')), [['<ul><li id="index::http://host\\"><a class="url" href="http://host\\" target="_blank">http://host\\</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- !http://host')), [['<ul><li id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></li></ul>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser, input('- [ ]')), [['<ul class="checklist"><li><span class="checkbox">☐</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [x]')), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [X]')), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [X] 1')), [['<ul class="checklist"><li id="index::1"><span class="checkbox">☑</span>1</li></ul>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('- [|a]')), [['<ul><li id="index::[|a]"><span class="invalid">[|a]</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|]')), [['<ul><li>a<span class="indexer" data-index=""></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|b]')), [['<ul><li id="index::b">a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- - [|b]')), [['<ul><li id="index::b">-<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [ ] [|a]')), [['<ul class="checklist"><li id="index::[|a]"><span class="checkbox">☐</span><span class="invalid">[|a]</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [ ] a [|b]')), [['<ul class="checklist"><li id="index::b"><span class="checkbox">☐</span>a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|]\n - c [|d]')), [['<ul><li>a<span class="indexer" data-index=""></span><ul><li id="index::d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|b]\n - c [|d]')), [['<ul><li id="index::b">a<span class="indexer" data-index="b"></span><ul><li id="index::d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
    });

  });

});
