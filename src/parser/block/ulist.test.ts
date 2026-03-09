import { ulist } from './ulist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/ulist', () => {
  describe('ulist', () => {
    const parser = some(ulist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('--', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-[]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-[ ]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-[x]', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('-\n- a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' - ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('+', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('*', new Context())), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser, input('- ', new Context())), [['<ul><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('- \\', new Context())), [['<ul><li id="index::\\">\\</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- \\\n', new Context())), [['<ul><li id="index::\\">\\</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- -', new Context())), [['<ul><li id="index::-">-</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- -\n', new Context())), [['<ul><li id="index::-">-</li></ul>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser, input('- \n-', new Context())), [['<ul><li></li><li></li></ul>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('- 1\n- 2', new Context())), [['<ul><li id="index::1">1</li><li id="index::2">2</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n- 2\n- 3', new Context())), [['<ul><li id="index::1">1</li><li id="index::2">2</li><li id="index::3">3</li></ul>'], '']);
      // invalid
      assert.deepStrictEqual(inspect(parser, input('- \n+', new Context())), [['<ul><li></li><li id="index::+"><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- \n0', new Context())), [['<ul><li></li><li id="index::0"><span class="invalid">0</span></li></ul>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('- \n -', new Context())), [['<ul><li><br><ul><li></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2', new Context())), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2\n- 3', new Context())), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li><li id="index::3">3</li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2\n - 3', new Context())), [['<ul><li id="index::1">1<ul><li id="index::2">2</li><li id="index::3">3</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n - 2\n  - 3', new Context())), [['<ul><li id="index::1">1<ul><li id="index::2">2<ul><li id="index::3">3</li></ul></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n  - 2\n - 3', new Context())), [['<ul><li id="index::1">1<ul><li id="index::2">2</li></ul></li><li id="index::-_3"><span class="invalid"> - 3</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- \n -\n +\n -\n +\n+', new Context())), [['<ul><li><br><ul><li></li><li id="index::+"><span class="invalid">+</span></li><li></li><li id="index::+"><span class="invalid">+</span></li></ul></li><li id="index::+"><span class="invalid">+</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n + 2', new Context())), [['<ul><li id="index::1">1<ul class="invalid"><li>2</li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0', new Context())), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0.', new Context())), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0. ', new Context())), [['<ul><li id="index::1">1<ol><li></li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- 1\n 0. 2', new Context())), [['<ul><li id="index::1">1<ol><li id="index::2">2</li></ol></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [#b]', new Context())), [['<ul><li id="index::a_b">a <a class="index" href="#index::b">b</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- http://host\\', new Context())), [['<ul><li id="index::http://host\\"><a class="url" href="http://host\\" target="_blank">http://host\\</a></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- !http://host', new Context())), [['<ul><li id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></li></ul>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser, input('- [ ]', new Context())), [['<ul class="checklist"><li><span class="checkbox">☐</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [x]', new Context())), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [X]', new Context())), [['<ul class="checklist"><li><span class="checkbox">☑</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [X] 1', new Context())), [['<ul class="checklist"><li id="index::1"><span class="checkbox">☑</span>1</li></ul>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('- [|a]', new Context())), [['<ul><li id="index::[|a]"><span class="invalid">[|a]</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|]', new Context())), [['<ul><li>a<span class="indexer" data-index=""></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|b]', new Context())), [['<ul><li id="index::b">a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- - [|b]', new Context())), [['<ul><li id="index::b">-<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [ ] [|a]', new Context())), [['<ul class="checklist"><li id="index::[|a]"><span class="checkbox">☐</span><span class="invalid">[|a]</span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- [ ] a [|b]', new Context())), [['<ul class="checklist"><li id="index::b"><span class="checkbox">☐</span>a<span class="indexer" data-index="b"></span></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|]\n - c [|d]', new Context())), [['<ul><li>a<span class="indexer" data-index=""></span><ul><li id="index::d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
      assert.deepStrictEqual(inspect(parser, input('- a [|b]\n - c [|d]', new Context())), [['<ul><li id="index::b">a<span class="indexer" data-index="b"></span><ul><li id="index::d">c<span class="indexer" data-index="d"></span></li></ul></li></ul>'], '']);
    });

  });

});
