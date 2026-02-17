import { reply } from './reply';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/reply', () => {
  describe('reply', () => {
    const parser = (source: string) => some(reply)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>1'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>>1 a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('> '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('> a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('>\n'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('>>1'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2 b'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><a class="anchor" href="?at=2">&gt;&gt;2</a> b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n> b'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><span class="quote">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n>>2'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\nb'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>>2'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>> b'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a<br>&gt;&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host\n>>http://host'), ctx), [['<p><span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span><br><span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span></p>'], '']);
    });

  });

});
