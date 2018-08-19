import { blockquote } from './blockquote';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/blockquote', () => {
  describe('blockquote', () => {
    const parser = some(blockquote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>a')), undefined);
      assert.deepStrictEqual(inspect(parser('>\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' >')), undefined);
      assert.deepStrictEqual(inspect(parser(' >a')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\')), [['<blockquote>\\</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\\n')), [['<blockquote>\\</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<blockquote>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<blockquote>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb')), [['<blockquote>a<br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n b ')), [['<blockquote>a<br>&nbsp;b&nbsp;</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>')), [['<blockquote>a<br></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>b')), [['<blockquote>a<br>&gt;b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote>a<br>b&nbsp;</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote>a<br></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote>a<br><br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote>a<br><br>&nbsp;b&nbsp;</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote>a<br><br></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>b')), [['<blockquote>a<br><br>&gt;b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b ')), [['<blockquote>a<br><br>b&nbsp;</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb')), [['<blockquote>a\\<br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a ')), [['<blockquote>&nbsp;a&nbsp;</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na')), [['<blockquote><br>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<blockquote><br>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a')), [['<blockquote><br>&nbsp;a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<blockquote><br></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a')), [['<blockquote><br>a</blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('> a\n>>')), [['<blockquote>a<blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n> c')), [['<blockquote>a<blockquote>b</blockquote>c</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>> c')), [['<blockquote>a<blockquote>b<br>c</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>>> c')), [['<blockquote>a<blockquote>b<blockquote>c</blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a')), [['<blockquote><blockquote>a</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>')), [['<blockquote><blockquote>a</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b')), [['<blockquote><blockquote>a</blockquote>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>> b\n> c')), [['<blockquote><blockquote>a<blockquote>b</blockquote></blockquote>c</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b\n>>> c')), [['<blockquote><blockquote>a</blockquote>b<blockquote><blockquote>c</blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>>> a\n>> b\n> c')), [['<blockquote><blockquote><blockquote>a</blockquote>b</blockquote>c</blockquote>'], '']);
    });

    it('markdown', () => {
      assert.deepStrictEqual(inspect(parser('!')), undefined);
      assert.deepStrictEqual(inspect(parser('!>')), undefined);
      assert.deepStrictEqual(inspect(parser('!> ')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \\\n')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\\\nb')), [['<blockquote><p>a<br>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\nb*')), [['<blockquote><p><em>a<span class="linebreak"> </span>b</em></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> *a\n> b*')), [['<blockquote><p><em>a<span class="linebreak"> </span>b</em></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>  a \n b  c ')), [['<blockquote><p>a <span class="linebreak"> </span> b  c</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> a\n> b')), [['<blockquote><blockquote><p>a</p></blockquote><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> - a')), [['<blockquote><ul><li>a</li></ul></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\na\n```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> ```')), [['<blockquote><pre class="notranslate">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> ```\n> a\n> \n> b\n> ```')), [['<blockquote><pre class="notranslate">a\n\nb</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> a\n>\n> b')), [['<blockquote><p>a</p><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><blockquote>a</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><blockquote>a<br>b</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><blockquote>a<br>b</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><blockquote>a</blockquote><blockquote><p>b</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><blockquote>a</blockquote></blockquote><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> !> a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> \na')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n')), undefined);
      assert.deepStrictEqual(inspect(parser('!>\na')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n a')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n>')), [['<blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>\n> a')), [['<blockquote><p>a</p></blockquote>'], '']);
    });

  });

});
