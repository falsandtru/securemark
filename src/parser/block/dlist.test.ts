import { dlist } from './dlist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/dlist', () => {
  describe('dlist', () => {
    const parser = some(dlist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~ ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~ \n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~ \na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~:', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~0', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a:b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a\n:b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a\n: b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n:', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n:\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n~\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n~\n:', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n:\n:', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ~ ', new Context())), undefined);
    });

    it('single', () => {
      assert.deepStrictEqual(inspect(parser, input('~ a', new Context())), [['<dl><dt id="index::a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ \\', new Context())), [['<dl><dt id="index::\\">\\</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ \\ a', new Context())), [['<dl><dt id="index::a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb', new Context())), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb\n', new Context())), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb\nc', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb\n\\\nc', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n~', new Context())), [['<dl><dt id="index::a">a</dt><dd>~</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n~b', new Context())), [['<dl><dt id="index::a">a</dt><dd>~b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n~ b', new Context())), [['<dl><dt id="index::a">a</dt><dt id="index::b">b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n:', new Context())), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: ', new Context())), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: \n', new Context())), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: \\', new Context())), [['<dl><dt id="index::a">a</dt><dd>\\</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n:b', new Context())), [['<dl><dt id="index::a">a</dt><dd>:b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b', new Context())), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n', new Context())), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\nc', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n\\\nc', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a~ b', new Context())), [['<dl><dt id="index::a~_b">a~ b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a: b', new Context())), [['<dl><dt id="index::a:_b">a: b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a \n: b\nc ', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a \n: b\n c ', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br> c</dd></dl>'], '']);
    });

    it('multiple', () => {
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n~ c\n: d', new Context())), [['<dl><dt id="index::a">a</dt><dd>b</dd><dt id="index::c">c</dt><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n  b\nc\n  d', new Context())), [['<dl><dt id="index::a">a</dt><dd>  b<br>c<br>  d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\nc\n: d', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\nc\n~ d\n: e', new Context())), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd><dt id="index::d">d</dt><dd>e</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n~ c\n: d\n~ e\n: f', new Context())), [['<dl><dt id="index::a">a</dt><dd>b</dd><dt id="index::c">c</dt><dd>d</dd><dt id="index::e">e</dt><dd>f</dd></dl>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('~ a [|b]', new Context())), [['<dl><dt id="index::b">a<span class="indexer" data-index="b"></span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a [|b]\\', new Context())), [['<dl><dt id="index::a_[|b]">a <span class="invalid">[|b]</span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ - [|b]', new Context())), [['<dl><dt id="index::b">-<span class="indexer" data-index="b"></span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ *A*', new Context())), [['<dl><dt id="index::A"><em>A</em></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ `A`', new Context())), [['<dl><dt id="index::`A`"><code data-src="`A`">A</code></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ ${A}$', new Context())), [['<dl><dt id="index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></dt><dd></dd></dl>'], '']);
    });

  });

});
