import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = some(paragraph);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<span class="linebreak"> </span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*')), [['<p><em>a</em></p>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('mention', () => {
      assert.deepStrictEqual(inspect(parser('>a')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span><span class="address" data-level="1"><a rel="noopener">&gt;b</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span><span class="quote">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\nc')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span><span class="quote">&gt; b</span>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\n>c')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span><span class="quote">&gt; b</span><span class="address" data-level="1"><a rel="noopener">&gt;c</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\n> c')), [['<p><span class="address" data-level="1"><a rel="noopener">&gt;a</a></span><span class="quote">&gt; b\n&gt; c</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\nc')), [['<p><span class="quote">&gt;a b</span>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\n>c')), [['<p><span class="quote">&gt;a b\n&gt;c</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>b')), [['<p>a&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >b')), [['<p>a &gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b')), [['<p>a<br>&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >a')), [['<p>&gt;a</p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# a #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [['<p><sup class="comment" title="a"></sup>b</p>'], '']);
    });

  });

});
