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
      assert.deepStrictEqual(inspect(parser('> \\')), [['<blockquote><p>\\</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \\\n')), [['<blockquote><p>\\</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<blockquote><p>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb')), [['<blockquote><p>a<br>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n b ')), [['<blockquote><p>a<br>&nbsp;b&nbsp;</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>')), [['<blockquote><p>a<br></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>b')), [['<blockquote><p>a<br>&gt;b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b ')), [['<blockquote><p>a<br>b&nbsp;</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n')), [['<blockquote><p>a<br></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\nb')), [['<blockquote><p>a<br><br>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n b ')), [['<blockquote><p>a<br><br>&nbsp;b&nbsp;</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>')), [['<blockquote><p>a<br><br></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n>b')), [['<blockquote><p>a<br><br>&gt;b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>\n> b ')), [['<blockquote><p>a<br><br>b&nbsp;</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\\\nb')), [['<blockquote><p>a\\<br>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>  a ')), [['<blockquote><p>&nbsp;a&nbsp;</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> \na')), [['<blockquote><p><br>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\na')), [['<blockquote><p><br>a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n a')), [['<blockquote><p><br>&nbsp;a</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n>')), [['<blockquote><p><br></p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>\n> a')), [['<blockquote><p><br>a</p></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('> a\n>>')), [['<blockquote><p>a</p><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n> c')), [['<blockquote><p>a</p><blockquote><p>b</p></blockquote><p>c</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>> c')), [['<blockquote><p>a</p><blockquote><p>b<br>c</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>>> c')), [['<blockquote><p>a</p><blockquote><p>b</p><blockquote><p>c</p></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b')), [['<blockquote><blockquote><p>a</p></blockquote><p>b</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>> b\n> c')), [['<blockquote><blockquote><p>a</p><blockquote><p>b</p></blockquote></blockquote><p>c</p></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b\n>>> c')), [['<blockquote><blockquote><p>a</p></blockquote><p>b</p><blockquote><blockquote><p>c</p></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>>> a\n>> b\n> c')), [['<blockquote><blockquote><blockquote><p>a</p></blockquote><p>b</p></blockquote><p>c</p></blockquote>'], '']);
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
      assert.deepStrictEqual(inspect(parser('!> > a')), [['<blockquote><blockquote><p>a</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> b')), [['<blockquote><blockquote><p>a<br>b</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n> > b')), [['<blockquote><blockquote><p>a<br>b</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!> > a\n>> b')), [['<blockquote><blockquote><p>a</p></blockquote><blockquote><p>b</p></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('!>> > a\n> b')), [['<blockquote><blockquote><blockquote><p>a</p></blockquote></blockquote><p>b</p></blockquote>'], '']);
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
