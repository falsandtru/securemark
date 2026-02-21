import { dlist } from './dlist';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/dlist', () => {
  describe('dlist', () => {
    const parser = (source: string) => some(dlist)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~ '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~ \n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~ \na'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~~'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~:'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~0'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~a:b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~a\n:b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~a\n: b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\n:'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\n:\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\n~\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\n~\n:'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\n:\n:'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~\na'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' ~ '), ctx), undefined);
    });

    it('single', () => {
      assert.deepStrictEqual(inspect(parser('~ a'), ctx), [['<dl><dt id="index::a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \\'), ctx), [['<dl><dt id="index::\\">\\</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \\ a'), ctx), [['<dl><dt id="index::a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb'), ctx), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb\n'), ctx), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb\nc'), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb\n\\\nc'), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~'), ctx), [['<dl><dt id="index::a">a</dt><dd>~</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~b'), ctx), [['<dl><dt id="index::a">a</dt><dd>~b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~ b'), ctx), [['<dl><dt id="index::a">a</dt><dt id="index::b">b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n:'), ctx), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: '), ctx), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: \n'), ctx), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: \\'), ctx), [['<dl><dt id="index::a">a</dt><dd>\\</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n:b'), ctx), [['<dl><dt id="index::a">a</dt><dd>:b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b'), ctx), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n'), ctx), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc'), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n\\\nc'), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a~ b'), ctx), [['<dl><dt id="index::a~_b">a~ b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a: b'), ctx), [['<dl><dt id="index::a:_b">a: b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a \n: b\nc '), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a \n: b\n c '), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br> c</dd></dl>'], '']);
    });

    it('multiple', () => {
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n~ c\n: d'), ctx), [['<dl><dt id="index::a">a</dt><dd>b</dd><dt id="index::c">c</dt><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n  b\nc\n  d'), ctx), [['<dl><dt id="index::a">a</dt><dd>  b<br>c<br>  d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc\n: d'), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc\n~ d\n: e'), ctx), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd><dt id="index::d">d</dt><dd>e</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n~ c\n: d\n~ e\n: f'), ctx), [['<dl><dt id="index::a">a</dt><dd>b</dd><dt id="index::c">c</dt><dd>d</dd><dt id="index::e">e</dt><dd>f</dd></dl>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser('~ a [|b]'), ctx), [['<dl><dt id="index::b">a<span class="indexer" data-index="b"></span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a [|b]\\'), ctx), [['<dl><dt id="index::a_[|b]">a <span class="invalid">[|b]</span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ A'), ctx), [['<dl><dt id="index::A">A</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ *A*'), ctx), [['<dl><dt id="index::A"><em>A</em></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ `A`'), ctx), [['<dl><dt id="index::`A`"><code data-src="`A`">A</code></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ ${A}$'), ctx), [['<dl><dt id="index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></dt><dd></dd></dl>'], '']);
    });

  });

});
