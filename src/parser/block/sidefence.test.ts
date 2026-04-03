import { sidefence } from './sidefence';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/sidefence', () => {
  describe('sidefence', () => {
    const parser = some(sidefence);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|a')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\na')), undefined);
      assert.deepStrictEqual(inspect(parser, input('|\n| a')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' | ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('||')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('| ')), [['<blockquote class="invalid"></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| \\')), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| \\\n')), [['<blockquote class="invalid"><pre>\\</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a')), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n')), [['<blockquote class="invalid"><pre>a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\nb')), [['<blockquote class="invalid"><pre>a</pre><pre class="invalid">b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n b \n')), [['<blockquote class="invalid"><pre>a</pre><pre class="invalid"> b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|')), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n||1')), [['<blockquote class="invalid"><pre>a</pre><pre class="invalid">||1</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n| b ')), [['<blockquote class="invalid"><pre>a<br>b </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|\n')), [['<blockquote class="invalid"><pre>a<br></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|  a ')), [['<blockquote class="invalid"><pre> a </pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| \na')), [['<blockquote class="invalid"><pre class="invalid">a</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| http://host')), [['<blockquote class="invalid"><pre><a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| http://host)')), [['<blockquote class="invalid"><pre><a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| !http://host')), [['<blockquote class="invalid"><pre>!<a class="url" href="http://host" target="_blank">http://host</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| !http://host)')), [['<blockquote class="invalid"><pre>!<a class="url" href="http://host)" target="_blank">http://host)</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| #a')), [['<blockquote class="invalid"><pre><a class="hashtag" href="/hashtags/a">#a</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| @a#b')), [['<blockquote class="invalid"><pre><a class="channel" href="/@a?ch=b">@a#b</a></pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| ||1\n| | b')), [['<blockquote class="invalid"><pre>||1<br>| b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| ||1\n| | b\n| c')), [['<blockquote class="invalid"><pre>||1<br>| b<br>c</pre></blockquote>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('| a\n||')), [['<blockquote class="invalid"><pre>a</pre><blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|| b\n| c')), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|| b\n|| c')), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b<br>c</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('| a\n|| b\n||| c')), [['<blockquote class="invalid"><pre>a</pre><blockquote><pre>b</pre><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n|')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n| b')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n||| b\n| c')), [['<blockquote class="invalid"><blockquote><pre>a</pre><blockquote><pre>b</pre></blockquote></blockquote><pre>c</pre></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('|| a\n| b\n||| c')), [['<blockquote class="invalid"><blockquote><pre>a</pre></blockquote><pre>b</pre><blockquote><blockquote><pre>c</pre></blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser, input('||| a\n|| b\n| c')), [['<blockquote class="invalid"><blockquote><blockquote><pre>a</pre></blockquote><pre>b</pre></blockquote><pre>c</pre></blockquote>'], '']);
    });

  });

});
