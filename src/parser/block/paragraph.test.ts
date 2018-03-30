import { paragraph } from './paragraph';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/paragraph', () => {
  describe('paragraph', () => {
    const parser = some(paragraph);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a \n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a<span class="newline"> </span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*')), [['<p><em>a<br></em></p>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('reference', () => {
      assert.deepStrictEqual(inspect(parser('>a')), [['<p><a class="reference" rel="noopener">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a ')), [['<p><a class="reference" rel="noopener">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<p><a class="reference" rel="noopener">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<p><a class="reference" rel="noopener">&gt;a</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n b')), [['<p><a class="reference" rel="noopener">&gt;a</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<p><a class="reference" rel="noopener">&gt;a</a><br><a class="reference" rel="noopener">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b\nc')), [['<p><a class="reference" rel="noopener">&gt;a</a><br><a class="reference" rel="noopener">&gt;b</a><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a')), [['<p><a class="reference" rel="noopener">&gt;&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a\n>b')), [['<p><a class="reference" rel="noopener">&gt;&gt;a</a><br><a class="reference" rel="noopener">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b')), [['<p>&gt;a b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a>b')), [['<p>a&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >b')), [['<p>a &gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b')), [['<p>a<span class="newline"> </span>&gt;b</p>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<p><a class="hashtag" rel="noopener">#a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<p><a class="hashtag" rel="noopener">#a</a><span class="newline"> </span>b<span class="newline"> </span><a class="hashtag" rel="noopener">#c</a><span class="newline"> </span><a href="#index:d" rel="noopener">d</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['<p>a#b</p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# #>a')), [['<p>a</p>'], '']);
    });

  });

});
