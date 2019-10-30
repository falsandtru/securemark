import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = (source: string) => some(paragraph)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('\\')), [[], '']);
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
      assert.deepStrictEqual(inspect(parser('>a')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb\n>c')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br>b<br><a rel="noopener" class="address" data-level="1">&gt;c</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br><a rel="noopener" class="address" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\nc')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b</span><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\n>c')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b</span><br><a rel="noopener" class="address" data-level="1">&gt;c</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\n> c')), [['<p><a rel="noopener" class="address" data-level="1">&gt;a</a><br><span class="quotation">&gt; b<br>&gt; c</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\nc')), [['<p><span class="quotation">&gt;a b</span><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b\n>c')), [['<p><span class="quotation">&gt;a b<br>&gt;c</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>b')), [['<p>a&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >b')), [['<p>a &gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b')), [['<p>a<br><a rel="noopener" class="address" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b\nc')), [['<p>a<br><a rel="noopener" class="address" data-level="1">&gt;b</a><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >a')), [['<p>&gt;a</p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# a #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [['<p><sup class="comment" title="a"></sup>b</p>'], '']);
    });

  });

});
