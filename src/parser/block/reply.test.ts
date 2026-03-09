import { reply } from './reply';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/reply', () => {
  describe('reply', () => {
    const parser = some(reply);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>>1 a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('> ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('> a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('>\n', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('>>1', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\na', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\na\n>>2', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\na\n>>2 b', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><a class="anchor" href="?at=2">&gt;&gt;2</a> b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\na\n> b', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br>a<br><span class="quote">&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\n>>2', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\n> a', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\n> a\nb', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br>b</p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\n> a\n>>2', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a</span><br><span class="cite">&gt;<a class="anchor" href="?at=2" data-depth="1">&gt;2</a></span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>1\n> a\n>> b', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="?at=1" data-depth="1">&gt;1</a></span><br><span class="quote">&gt; a<br>&gt;&gt; b</span></p>'], '']);
      assert.deepStrictEqual(inspect(parser, input('>>http://host\n>>http://host', new Context())), [['<p><span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span><br><span class="cite">&gt;<a class="anchor" href="http://host" target="_blank" data-depth="1">&gt;http://host</a></span></p>'], '']);
    });

  });

});
