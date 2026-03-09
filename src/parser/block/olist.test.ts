import { olist } from './olist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/olist', () => {
  describe('olist', () => {
    const parser = some(olist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1a. ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a1. ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('aZ. ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('Az. ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1 ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1 ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.1.', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('1.\n1. a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(1)', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(1)\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(1)\n(1) a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('I. ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('A. ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(I) ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(A) ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' 1. ', new Context())), undefined);
    });

    it('single', () => {
      // pending
      assert.deepStrictEqual(inspect(parser, input('1. ', new Context())), [['<ol><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('1. \\', new Context())), [['<ol><li id="index::\\">\\</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \\\n', new Context())), [['<ol><li id="index::\\">\\</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. -', new Context())), [['<ol><li id="index::-">-</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. -\n', new Context())), [['<ol><li id="index::-">-</li></ol>'], '']);
      // pending
      assert.deepStrictEqual(inspect(parser, input('(1) ', new Context())), [['<ol data-format="paren"><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('(1) a', new Context())), [['<ol data-format="paren"><li id="index::a">a</li></ol>'], '']);
    });

    it('multiple', () => {
      // pending
      assert.deepStrictEqual(inspect(parser, input('0. \n0', new Context())), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. \n0\n', new Context())), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. \n0.', new Context())), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. \n0. ', new Context())), [['<ol><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. \n0.\n', new Context())), [['<ol><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('0. 1\n0. 2', new Context())), [['<ol><li id="index::1">1</li><li id="index::2">2</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n0. 2\n0. 3', new Context())), [['<ol><li id="index::1">1</li><li id="index::2">2</li><li id="index::3">3</li></ol>'], '']);
      // pending
      assert.deepStrictEqual(inspect(parser, input('(1) \n(', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(\n', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1\n', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1)', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1)\n', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      // filled
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1) ', new Context())), [['<ol data-format="paren"><li></li><li></li></ol>'], '']);
      // invalid
      assert.deepStrictEqual(inspect(parser, input('0. \n0 ', new Context())), [['<ol><li></li><li id="index::0"><span class="invalid">0 </span></li></ol>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('0. \n 0', new Context())), [['<ol><li><br><ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0', new Context())), [['<ol><li id="index::1">1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0.', new Context())), [['<ol><li id="index::1">1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0. ', new Context())), [['<ol><li id="index::1">1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0.\n', new Context())), [['<ol><li id="index::1">1<ol><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0. 2', new Context())), [['<ol><li id="index::1">1<ol><li id="index::2">2</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0. 2\n0. 3', new Context())), [['<ol><li id="index::1">1<ol><li id="index::2">2</li></ol></li><li id="index::3">3</li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0. 2\n 0. 3', new Context())), [['<ol><li id="index::1">1<ol><li id="index::2">2</li><li id="index::3">3</li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n 0. 2\n  0. 3', new Context())), [['<ol><li id="index::1">1<ol><li id="index::2">2<ol><li id="index::3">3</li></ol></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. 1\n  0. 2\n 0. 3', new Context())), [['<ol><li id="index::1">1<ol><li id="index::2">2</li></ol></li><li id="index::0._3"><span class="invalid"> 0. 3</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. a [#b]', new Context())), [['<ol><li id="index::a_b">a <a class="index" href="#index::b">b</a></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. http://host\\', new Context())), [['<ol><li id="index::http://host\\"><a class="url" href="http://host\\" target="_blank">http://host\\</a></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. !http://host', new Context())), [['<ol><li id="index::!http://host">!<a class="url" href="http://host" target="_blank">http://host</a></li></ol>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser, input('1. ', new Context())), [['<ol><li></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('9. ', new Context())), [['<ol><li data-marker="9."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('00. ', new Context())), [['<ol><li data-marker="00."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('01. ', new Context())), [['<ol><li data-marker="01."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('0. \n1', new Context())), [['<ol><li></li><li data-marker="1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('8. \n9', new Context())), [['<ol><li data-marker="8."></li><li data-marker="9."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('9. \n9', new Context())), [['<ol><li data-marker="9."></li><li data-marker="9." class="invalid"></li></ol>'], '']);
    });

    it('branch', () => {
      assert.deepStrictEqual(inspect(parser, input('1-1. ', new Context())), [['<ol><li data-marker="1-1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1-1-1. ', new Context())), [['<ol><li data-marker="1-1-1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n1-', new Context())), [['<ol><li></li><li data-marker="1-."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n1-1', new Context())), [['<ol><li></li><li data-marker="1-1."></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1)-1 ', new Context())), [['<ol data-format="paren"><li data-marker="(1)-1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1)-1-1 ', new Context())), [['<ol data-format="paren"><li data-marker="(1)-1-1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1)-', new Context())), [['<ol data-format="paren"><li></li><li data-marker="(1)-"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1)-1', new Context())), [['<ol data-format="paren"><li></li><li data-marker="(1)-1"></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n1--', new Context())), [['<ol><li></li><li id="index::1--"><span class="invalid">1--</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n1--. ', new Context())), [['<ol><li></li><li id="index::1--."><span class="invalid">1--. </span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1)--', new Context())), [['<ol data-format="paren"><li></li><li id="index::(1)--"><span class="invalid">(1)--</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(1) \n(1)-- ', new Context())), [['<ol data-format="paren"><li></li><li id="index::(1)--"><span class="invalid">(1)-- </span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1-1. 1', new Context())), [['<ol><li data-marker="1-1." id="index::1">1</li></ol>'], '']);
    });

    it('type', () => {
      assert.deepStrictEqual(inspect(parser, input('1. \n i. ', new Context())), [['<ol><li><br><ol type="i" data-type="lower-roman"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n a. ', new Context())), [['<ol><li><br><ol type="a" data-type="lower-alpha"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n I. ', new Context())), [['<ol><li><br><ol type="I" data-type="upper-roman"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n A. ', new Context())), [['<ol><li><br><ol type="A" data-type="upper-alpha"><li></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n a. \n 1.\n c', new Context())), [['<ol><li><br><ol type="a" data-type="lower-alpha"><li></li><li data-marker="1."></li><li data-marker="c."></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. \n i. 1', new Context())), [['<ol><li><br><ol type="i" data-type="lower-roman"><li id="index::1">1</li></ol></li></ol>'], '']);
    });

    it('checkbox', () => {
      assert.deepStrictEqual(inspect(parser, input('1. [ ]', new Context())), [['<ol class="checklist"><li><span class="checkbox">☐</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. [x]', new Context())), [['<ol class="checklist"><li><span class="checkbox">☑</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. [X]', new Context())), [['<ol class="checklist"><li><span class="checkbox">☑</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. [X] 1', new Context())), [['<ol class="checklist"><li id="index::1"><span class="checkbox">☑</span>1</li></ol>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('1. [|a]', new Context())), [['<ol><li id="index::[|a]"><span class="invalid">[|a]</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. a [|]', new Context())), [['<ol><li>a<span class="indexer" data-index=""></span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. a [|b]', new Context())), [['<ol><li id="index::b">a<span class="indexer" data-index="b"></span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. - [|]', new Context())), [['<ol><li>-<span class="indexer" data-index=""></span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. [ ] [|a]', new Context())), [['<ol class="checklist"><li id="index::[|a]"><span class="checkbox">☐</span><span class="invalid">[|a]</span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. [ ] a [|b]', new Context())), [['<ol class="checklist"><li id="index::b"><span class="checkbox">☐</span>a<span class="indexer" data-index="b"></span></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. a [|]\n 1. c [|d]', new Context())), [['<ol><li>a<span class="indexer" data-index=""></span><ol><li id="index::d">c<span class="indexer" data-index="d"></span></li></ol></li></ol>'], '']);
      assert.deepStrictEqual(inspect(parser, input('1. a [|b]\n 1. c [|d]', new Context())), [['<ol><li id="index::b">a<span class="indexer" data-index="b"></span><ol><li id="index::d">c<span class="indexer" data-index="d"></span></li></ol></li></ol>'], '']);
    });

  });

});
