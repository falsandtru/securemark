import { sidefence } from './sidefence';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/sidefence', () => {
  describe('sidefence', () => {
    const parser = some(sidefence);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('|', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('|a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' | ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('||', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('| ', new Context())), [['<blockquote class="invalid"></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| \\', new Context())), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| \\\n', new Context())), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a', new Context())), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n', new Context())), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\nb', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| a\n b ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| a\n|', new Context())), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n>>1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| a\n| b ', new Context())), [['<blockquote class="invalid"><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\n', new Context())), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\nb', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\n b ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\n|', new Context())), [['<blockquote class="invalid"><pre>a<br><br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\n>>1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\n| b ', new Context())), [['<blockquote class="invalid"><pre>a<br><br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\\\nb', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('|  a ', new Context())), [['<blockquote class="invalid"><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| \na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\na', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\n| a', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('| http://host', new Context())), [['<blockquote class="invalid"><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| http://host)', new Context())), [['<blockquote class="invalid"><pre><a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| !http://host', new Context())), [['<blockquote class="invalid"><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| !http://host)', new Context())), [['<blockquote class="invalid"><pre>!<a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| #a', new Context())), [['<blockquote class="invalid"><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| @a#b', new Context())), [['<blockquote class="invalid"><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| >>1\n| | b', new Context())), [['<blockquote class="invalid"><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>| b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| >>1\n| | b\n| c', new Context())), [['<blockquote class="invalid"><pre><a class="anchor" href="?at=1">&gt;&gt;1</a><br>| b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('| a\n||', new Context())), [['<blockquote class="invalid"><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|| b\n| c', new Context())), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|| b\n|| c', new Context())), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|| b\n||| c', new Context())), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a', new Context())), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n|', new Context())), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n| b', new Context())), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n||| b\n| c', new Context())), [['<blockquote class="invalid"><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n| b\n||| c', new Context())), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||| a\n|| b\n| c', new Context())), [['<blockquote class="invalid"><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

  });

});
