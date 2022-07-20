import { sidefence } from './sidefence';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/sidefence', () => {
  describe('sidefence', () => {
    const parser = (source: string) => some(sidefence)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('|')), undefined);
      assert.deepStrictEqual(inspect(parser('|a')), undefined);
      assert.deepStrictEqual(inspect(parser('|\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' | ')), undefined);
      assert.deepStrictEqual(inspect(parser('||')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('| ')), [['<blockquote class="invalid"></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| \\')), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| \\\n')), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a')), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n')), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n b ')), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|')), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n>>1')), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n| b ')), [['<blockquote class="invalid"><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|\n')), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|\n b ')), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|\n|')), [['<blockquote class="invalid"><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|\n>>1')), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|\n| b ')), [['<blockquote class="invalid"><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\\\nb')), undefined);
      assert.deepStrictEqual(inspect(parser('|  a ')), [['<blockquote class="invalid"><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| \na')), undefined);
      assert.deepStrictEqual(inspect(parser('|\na')), undefined);
      assert.deepStrictEqual(inspect(parser('|\n a')), undefined);
      assert.deepStrictEqual(inspect(parser('|\n|')), [['<blockquote class="invalid"><pre><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n| a')), [['<blockquote class="invalid"><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| http://host')), [['<blockquote class="invalid"><pre><a href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| !http://host')), [['<blockquote class="invalid"><pre>!<a href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| #a')), [['<blockquote class="invalid"><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| @a#b')), [['<blockquote class="invalid"><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| >>1\n| | b')), [['<blockquote class="invalid"><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>| b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| >>1\n| | b\n| c')), [['<blockquote class="invalid"><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>| b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('| a\n||')), [['<blockquote class="invalid"><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|| b\n| c')), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|| b\n|| c')), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|| b\n||| c')), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n|')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n| b')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n||| b\n| c')), [['<blockquote class="invalid"><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n| b\n||| c')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('||| a\n|| b\n| c')), [['<blockquote class="invalid"><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

  });

});
