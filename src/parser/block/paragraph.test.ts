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
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a<span class="linebreak"> </span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*')), [['<p><em>a</em></p>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('mention', () => {
      assert.deepStrictEqual(inspect(parser('>a')), [['<p><a class="address" rel="noopener" data-level="1">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b')), [[`<p>&gt;a b</p>`], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<p><a class="address" rel="noopener" data-level="1">&gt;a</a>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<p><a class="address" rel="noopener" data-level="1">&gt;a</a><a class="address" rel="noopener" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b')), [['<p><a class="address" rel="noopener" data-level="1">&gt;a</a><span class="quote">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n> b\nc')), [['<p><a class="address" rel="noopener" data-level="1">&gt;a</a><span class="quote">&gt; b</span>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>b')), [['<p>a&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >b')), [['<p>a &gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b')), [['<p>a<span class="linebreak"> </span>&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >a')), [['<p>&gt;a</p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# a #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>b')), [['<p><sup class="comment" title="a"></sup>b</p>'], '']);
    });

  });

});
