import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = (source: string) => some(paragraph)(source, {});

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\\')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\ ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\ \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<span class="linebreak"> </span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('mention', () => {
      assert.deepStrictEqual(inspect(parser('>a')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb\n>c')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br>b<br><a href="?log=c" rel="noopener" class="address" data-level="1">&gt;c</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br><a href="?log=b" rel="noopener" class="address" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\nc')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b</span><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\n>c')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b</span><br><a href="?log=c" rel="noopener" class="address" data-level="1">&gt;c</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\n> c')), [['<p><a href="?log=a" rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b<br>&gt; c</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\nc')), [['<p><span class="quotation">&gt;a b</span><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\n>c')), [['<p><span class="quotation">&gt;a b<br>&gt;c</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>b')), [['<p>a&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >b')), [['<p>a &gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b')), [['<p>a<br><a href="?log=b" rel="noopener" class="address" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b\nc')), [['<p>a<br><a href="?log=b" rel="noopener" class="address" data-level="1">&gt;b</a><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >a')), [['<p>&gt;a</p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# a #>')), [['<p class="invalid"><sup class="comment" title="a"></sup></p>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [['<p><sup class="comment" title="a"></sup>b</p>'], '']);
    });

  });

});
