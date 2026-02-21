import { ulist } from './ulist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ulist', () => {
  describe('ulist', () => {
    const parser = (source: string) => some(ulist)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('--'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-[]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-[ ]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-[x]'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('-\n- a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' - '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('+'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*'), ctx), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('- '), ctx), [['<ul><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('- \\'), ctx), [['<ul><li id="index::\\">\\</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- \\\n'), ctx), [['<ul><li id="index::\\">\\</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -'), ctx), [['<ul><li id="index::-">-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- -\n'), ctx), [['<ul><li id="index::-">-</li></ul>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser('- \n-'), ctx), [['<ul><li></li><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser('- 1\n- 2'), ctx), [['<ul><li id="index::1">1</li><li id="index::2">2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n- 2\n- 3'), ctx), [['<ul><li id="index::1">1</li><li id="index::2">2</li><li id="index::3">3</li></ul>'], '']);
      // invalid
      assert.deepStrictEqual(inspect(parser('- \n+'), ctx), [['<ul><li></li><li id="index::+"><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- \n0'), ctx), [['<ul><li></li><li id="index::0"><span class="invalid">0</span></li></ul>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('- \n -'), ctx), [['<ul><li><br><ul><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2'), ctx), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n- 3'), ctx), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li><li id="index::3">3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n - 3'), ctx), [['<ul><li id="index::1">1<ul><li id="index::2">2</li><li id="index::3">3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n - 2\n  - 3'), ctx), [['<ul><li id="index::1">1<ul><li id="index::2">2<ul><li id="index::3">3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n  - 2\n - 3'), ctx), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li><li id="index::-_3"><span class="invalid"> - 3</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- \n -\n +\n -\n +\n+'), ctx), [['<ul><li><br><ul><li></li><li id="index::+"><span class="invalid">+</span></li><li></li><li id="index::+"><span class="invalid">+</span></li></ul></li><li id="index::+"><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n + 2'), ctx), [['<ul><li id="index::1">1<ul class="invalid"><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0'), ctx), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0.'), ctx), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0. '), ctx), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- 1\n 0. 2'), ctx), [['<ul><li id="index::1">1<ol><li id="index::2">2</li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [#b]'), ctx), [['<ul><li id="index::a_b">a <a class="index" href="#index::b">b</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- http://host\\'), ctx), [['<ul><li id="index::http://host\\"><a class="url" href="http://host\\" target="_blank">http://host\\</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- !http://host'), ctx), [['<ul><li id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></li></ul>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser('- [ ]'), ctx), [['<ul class="checklist"><li><span class="checkbox">☐</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [x]'), ctx), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [X]'), ctx), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [X] 1'), ctx), [['<ul class="checklist"><li id="index::1"><span class="checkbox">☑</span>1</li></ul>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('- [|a]'), ctx), [['<ul><li id="index::[|a]"><span class="invalid">[|a]</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [|]'), ctx), [['<ul><li>a<span class="indexer" data-index=""></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [|b]'), ctx), [['<ul><li id="index::b">a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ] [|a]'), ctx), [['<ul class="checklist"><li id="index::[|a]"><span class="checkbox">☐</span><span class="invalid">[|a]</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- [ ] a [|b]'), ctx), [['<ul class="checklist"><li id="index::b"><span class="checkbox">☐</span>a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [|]\n - c [|d]'), ctx), [['<ul><li>a<span class="indexer" data-index=""></span><ul><li id="index::d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser('- a [|b]\n - c [|d]'), ctx), [['<ul><li id="index::b">a<span class="indexer" data-index="b"></span><ul><li id="index::d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
    });

  });

});
