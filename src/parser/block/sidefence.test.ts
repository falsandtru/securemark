import { sidefence } from './sidefence';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/sidefence', () => {
  describe('sidefence', () => {
    const parser = (source: string) => some(sidefence)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' | '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('||'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('| '), ctx), [['<blockquote class="invalid"></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| \\'), ctx), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| \\\n'), ctx), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a'), ctx), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n'), ctx), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\nb'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n b '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|'), ctx), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n>>1'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n| b '), ctx), [['<blockquote class="invalid"><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|\n'), ctx), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|\nb'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|\n b '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|\n|'), ctx), [['<blockquote class="invalid"><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|\n>>1'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('| a\n|\n| b '), ctx), [['<blockquote class="invalid"><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\\\nb'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|  a '), ctx), [['<blockquote class="invalid"><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| \na'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|\na'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|\n a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('|\n|'), ctx), [['<blockquote class="invalid"><pre><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|\n| a'), ctx), [['<blockquote class="invalid"><pre><br>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| http://host'), ctx), [['<blockquote class="invalid"><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| http://host)'), ctx), [['<blockquote class="invalid"><pre><a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| !http://host'), ctx), [['<blockquote class="invalid"><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| !http://host)'), ctx), [['<blockquote class="invalid"><pre>!<a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| #a'), ctx), [['<blockquote class="invalid"><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| @a#b'), ctx), [['<blockquote class="invalid"><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| >>1\n| | b'), ctx), [['<blockquote class="invalid"><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>| b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| >>1\n| | b\n| c'), ctx), [['<blockquote class="invalid"><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>| b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('| a\n||'), ctx), [['<blockquote class="invalid"><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|| b\n| c'), ctx), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|| b\n|| c'), ctx), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('| a\n|| b\n||| c'), ctx), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a'), ctx), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n|'), ctx), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n| b'), ctx), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n||| b\n| c'), ctx), [['<blockquote class="invalid"><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('|| a\n| b\n||| c'), ctx), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('||| a\n|| b\n| c'), ctx), [['<blockquote class="invalid"><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

  });

});
