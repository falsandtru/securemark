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
      assert.deepStrictEqual(inspect(parser('>1')), [['<p><span class="quotation"><a class="address" href="?res=1" rel="noopener">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1\na')), [['<p><span class="quotation"><a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1\na\n>2')), [['<p><span class="quotation"><a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br>a<br><span class="quotation"><a class="address" href="?res=2" rel="noopener">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1\n>2')), [['<p><span class="quotation"><a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br><span class="quotation"><a class="address" href="?res=2" rel="noopener">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br>a<br><span class="quotation">&gt;<a class="address" href="?res=2" rel="noopener">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n>>2')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br><span class="quotation">&gt;<a class="address" href="?res=2" rel="noopener">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br><span class="quotation">&gt; a</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\nb')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br><span class="quotation">&gt; a</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>>2')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br><span class="quotation">&gt; a</span><br><span class="quotation">&gt;<a class="address" href="?res=2" rel="noopener">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>> b')), [['<p><span class="quotation">&gt;<a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br><span class="quotation">&gt; a<br>&gt;&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1 a\nb')), [['<p><a class="address" href="?res=1" rel="noopener">&gt;1</a> a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1 a\n>2')), [['<p><a class="address" href="?res=1" rel="noopener">&gt;1</a> a<br><span class="quotation"><a class="address" href="?res=2" rel="noopener">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1 a\n>b')), [['<p><a class="address" href="?res=1" rel="noopener">&gt;1</a> a<br><span class="quotation">&gt;b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>1 a\n> 2')), [['<p><a class="address" href="?res=1" rel="noopener">&gt;1</a> a<br><span class="quotation">&gt; 2</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>11.')), [['<p><a class="address" href="?res=11" rel="noopener">&gt;11</a>.</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>11 a')), [['<p><a class="address" href="?res=11" rel="noopener">&gt;11</a> a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>1')), [['<p>a<a class="address" href="?res=1" rel="noopener">&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >1')), [['<p>a <a class="address" href="?res=1" rel="noopener">&gt;1</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>1')), [['<p>a<br><span class="quotation"><a class="address" href="?res=1" rel="noopener">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>1\nb')), [['<p>a<br><span class="quotation"><a class="address" href="?res=1" rel="noopener">&gt;1</a></span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >1')), [['<p><a class="address" href="?res=1" rel="noopener">&gt;1</a></p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# a #>')), [['<p class="invalid"><sup class="comment" title="a"></sup></p>'], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [['<p><sup class="comment" title="a"></sup>b</p>'], '']);
    });

  });

});
