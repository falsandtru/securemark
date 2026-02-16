import { reply } from './reply';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/reply', () => {
  describe('reply', () => {
    const parser = (source: string) => some(reply)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('>')), undefined);
      assert.deepStrictEqual(inspect(parser('>1')), undefined);
      assert.deepStrictEqual(inspect(parser('>>')), undefined);
      assert.deepStrictEqual(inspect(parser('>>1 a')), undefined);
      assert.deepStrictEqual(inspect(parser('> ')), undefined);
      assert.deepStrictEqual(inspect(parser('> a')), undefined);
      assert.deepStrictEqual(inspect(parser('>\n')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('>>1')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n>>2 b')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><a class="anchor" href="?at=2">&gt;&gt;2</a> b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\na\n> b')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><span class="quote">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n>>2')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\nb')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>>2')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>1\n> a\n>> b')), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a<br>&gt;&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser('>>http://host\n>>http://host')), [['<p><span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span><br><span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span></p>'], '']);
    });

  });

});
