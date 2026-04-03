import { dlist } from './dlist';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/dlist', () => {
  describe('dlist', () => {
    const parser = some(dlist);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~ ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~ \n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~ \na')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~:')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~0')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a:b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a\n:b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~a\n: b')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n:')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n:\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n~\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n~\n:')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\n:\n:')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~\na')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ~ ')), undefined);
    });

    it('single', () => {
      assert.deepStrictEqual(inspect(parser, input('~ a')), [['<dl><dt id="index::a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ \\')), [['<dl><dt id="index::\\">\\</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ \\ a')), [['<dl><dt id="index::a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb')), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb\n')), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb\nc')), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\nb\n\\\nc')), [['<dl><dt id="index::a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n~')), [['<dl><dt id="index::a">a</dt><dd>~</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n~b')), [['<dl><dt id="index::a">a</dt><dd>~b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n~ b')), [['<dl><dt id="index::a">a</dt><dt id="index::b">b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n:')), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: ')), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: \n')), [['<dl><dt id="index::a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: \\')), [['<dl><dt id="index::a">a</dt><dd>\\</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n:b')), [['<dl><dt id="index::a">a</dt><dd>:b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b')), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n')), [['<dl><dt id="index::a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\nc')), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n\\\nc')), [['<dl><dt id="index::a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a~ b')), [['<dl><dt id="index::a~_b">a~ b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a: b')), [['<dl><dt id="index::a:_b">a: b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a \n: b\nc ')), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a \n: b\n c ')), [['<dl><dt id="index::a">a</dt><dd>b<br> c</dd></dl>'], '']);
    });

    it('multiple', () => {
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n~ c\n: d')), [['<dl><dt id="index::a">a</dt><dd>b</dd><dt id="index::c">c</dt><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n  b\nc\n  d')), [['<dl><dt id="index::a">a</dt><dd>  b<br>c<br>  d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\nc\n: d')), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\nc\n~ d\n: e')), [['<dl><dt id="index::a">a</dt><dd>b<br>c</dd><dt id="index::d">d</dt><dd>e</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a\n: b\n~ c\n: d\n~ e\n: f')), [['<dl><dt id="index::a">a</dt><dd>b</dd><dt id="index::c">c</dt><dd>d</dd><dt id="index::e">e</dt><dd>f</dd></dl>'], '']);
    });

    it('indexer', () => {
      assert.deepStrictEqual(inspect(parser, input('~ a [|b]')), [['<dl><dt id="index::b">a<span class="indexer" data-index="b"></span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ a [|b]\\')), [['<dl><dt id="index::a_[|b]">a <span class="invalid">[|b]</span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ - [|b]')), [['<dl><dt id="index::b">-<span class="indexer" data-index="b"></span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ *A*')), [['<dl><dt id="index::A"><em>A</em></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ `A`')), [['<dl><dt id="index::`A`"><code data-src="`A`">A</code></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~ ${A}$')), [['<dl><dt id="index::${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></dt><dd></dd></dl>'], '']);
    });

  });

});
