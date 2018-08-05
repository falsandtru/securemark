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
      assert.deepStrictEqual(inspect(parser('a\nb')), [['<p>a<span class="linebreak"> <wbr></span>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\nb')), [['<p>a<br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*')), [['<p><em>a<br></em></p>'], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [['<p>a</p>'], '']);
    });

    it('reference', () => {
      assert.deepStrictEqual(inspect(parser('>a')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a ')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n b')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a><br><a class="reference" rel="noopener" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b\nc')), [['<p><a class="reference" rel="noopener" data-level="1">&gt;a</a><br><a class="reference" rel="noopener" data-level="1">&gt;b</a><br>c</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a')), [['<p><a class="reference" rel="noopener" data-level="2">&gt;&gt;a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>a\n>b')), [['<p><a class="reference" rel="noopener" data-level="2">&gt;&gt;a</a><br><a class="reference" rel="noopener" data-level="1">&gt;b</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>a b')), [[`<p><span class="invalid">Invalid syntax: Reference syntax: Use lower-case alphanumeric characters in reference syntax.</span></p>`], '']);
      assert.deepStrictEqual(inspect(parser('a>b')), [['<p>a&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a >b')), [['<p>a &gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('a\n>b')), [['<p>a<span class="linebreak"> <wbr></span>&gt;b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' >a')), [['<p>&gt;a</p>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a')), [['<p><a class="hashtag" rel="noopener" data-level="1">#a</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<p><a class="hashtag" rel="noopener" data-level="1">#a</a><span class="linebreak"> <wbr></span>b<span class="linebreak"> <wbr></span><a class="hashtag" rel="noopener" data-level="1">#c</a><span class="linebreak"> <wbr></span><a href="#index:d" rel="noopener">d</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['<p>a#b</p>'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [['<p><a class="hashtag" rel="noopener" data-level="1">#a</a></p>'], '']);
    });

    it('comment', () => {
      assert.deepStrictEqual(inspect(parser('<# #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# a #>')), [[], '']);
      assert.deepStrictEqual(inspect(parser('<# #>a')), [['<p>a</p>'], '']);
    });

  });

});
