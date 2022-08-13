import { dlist } from './dlist';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/dlist', () => {
  describe('dlist', () => {
    const parser = (source: string) => some(dlist)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~')), undefined);
      assert.deepStrictEqual(inspect(parser('~ ')), undefined);
      assert.deepStrictEqual(inspect(parser('~ \n')), undefined);
      assert.deepStrictEqual(inspect(parser('~ \na')), undefined);
      assert.deepStrictEqual(inspect(parser('~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~:')), undefined);
      assert.deepStrictEqual(inspect(parser('~0')), undefined);
      assert.deepStrictEqual(inspect(parser('~a')), undefined);
      assert.deepStrictEqual(inspect(parser('~a:b')), undefined);
      assert.deepStrictEqual(inspect(parser('~a\n:b')), undefined);
      assert.deepStrictEqual(inspect(parser('~a\n: b')), undefined);
      assert.deepStrictEqual(inspect(parser('~\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~\n:')), undefined);
      assert.deepStrictEqual(inspect(parser('~\n:\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~\n~\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~\n~\n:')), undefined);
      assert.deepStrictEqual(inspect(parser('~\n:\n:')), undefined);
      assert.deepStrictEqual(inspect(parser('~\na')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~ ')), undefined);
    });

    it('single', () => {
      assert.deepStrictEqual(inspect(parser('~ a')), [['<dl><dt id="index:a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \\')), [['<dl><dt id="index:\\">\\</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ \\ a')), [['<dl><dt id="index:a">a</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb')), [['<dl><dt id="index:a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb\n')), [['<dl><dt id="index:a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb\nc')), [['<dl><dt id="index:a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\nb\n\\\nc')), [['<dl><dt id="index:a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~')), [['<dl><dt id="index:a">a</dt><dd>~</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~b')), [['<dl><dt id="index:a">a</dt><dd>~b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n~ b')), [['<dl><dt id="index:a">a</dt><dt id="index:b">b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n:')), [['<dl><dt id="index:a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: ')), [['<dl><dt id="index:a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: \n')), [['<dl><dt id="index:a">a</dt><dd>:</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: \\')), [['<dl><dt id="index:a">a</dt><dd>\\</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n:b')), [['<dl><dt id="index:a">a</dt><dd>:b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b')), [['<dl><dt id="index:a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n')), [['<dl><dt id="index:a">a</dt><dd>b</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc')), [['<dl><dt id="index:a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n\\\nc')), [['<dl><dt id="index:a">a</dt><dd>b<br>\\<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a~ b')), [['<dl><dt id="index:a~_b">a~ b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a: b')), [['<dl><dt id="index:a:_b">a: b</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a \n: b \nc ')), [['<dl><dt id="index:a">a</dt><dd>b<br>c</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a \n: b\n c ')), [['<dl><dt id="index:a">a</dt><dd>b<br> c</dd></dl>'], '']);
    });

    it('multiple', () => {
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n~ c\n: d')), [['<dl><dt id="index:a">a</dt><dd>b</dd><dt id="index:c">c</dt><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n  b\nc\n  d')), [['<dl><dt id="index:a">a</dt><dd>  b<br>c<br>  d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc\n: d')), [['<dl><dt id="index:a">a</dt><dd>b<br>c</dd><dd>d</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\nc\n~ d\n: e')), [['<dl><dt id="index:a">a</dt><dd>b<br>c</dd><dt id="index:d">d</dt><dd>e</dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a\n: b\n~ c\n: d\n~ e\n: f')), [['<dl><dt id="index:a">a</dt><dd>b</dd><dt id="index:c">c</dt><dd>d</dd><dt id="index:e">e</dt><dd>f</dd></dl>'], '']);
    });

    it('index', () => {
      assert.deepStrictEqual(inspect(parser('~ a [#b]')), [['<dl><dt id="index:b">a<span class="indexer" data-index="b"></span></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ a [#b]\\')), [['<dl><dt id="index:a_[#b]">a [<a class="hashtag" href="/hashtags/b">#b</a>]</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ A')), [['<dl><dt id="index:A">A</dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ _A_')), [['<dl><dt id="index:A"><em>A</em></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ `A`')), [['<dl><dt id="index:`A`"><code data-src="`A`">A</code></dt><dd></dd></dl>'], '']);
      assert.deepStrictEqual(inspect(parser('~ ${A}$')), [['<dl><dt id="index:${A}$"><span class="math" translate="no" data-src="${A}$">${A}$</span></dt><dd></dd></dl>'], '']);
    });

  });

});
