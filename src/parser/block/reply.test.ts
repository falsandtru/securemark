import { reply } from './reply';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/reply', () => {
  describe('reply', () => {
    const parser = (source: string) => some(reply)({ source, context: {} });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('>>1')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><a class="anchor" href="?at=2">&gt;&gt;2</a></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n>>2')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\nb')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>>2')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>> b')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a<br>&gt;&gt; b</span></p>'], '']);
    });

  });

});
