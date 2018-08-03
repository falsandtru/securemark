import { example } from './example';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = some(example);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(' ~~~example/markdown\na\n~~~')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~')), [['<aside class="example" data-type="markdown"><pre>a</pre><div><p>a</p></div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n*a\nb*\n~~~')), [['<aside class="example" data-type="markdown"><pre>*a\nb*</pre><div><p><em>a<span class="linebreak"> <wbr></span>b</em></p></div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n> a\nb\n~~~')), [['<aside class="example" data-type="markdown"><pre>&gt; a\nb</pre><div><blockquote>a<br>b</blockquote></div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n> a\n> b\n~~~')), [['<aside class="example" data-type="markdown"><pre>&gt; a\n&gt; b</pre><div><blockquote>a<br>b</blockquote></div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~~')), [['<aside class="example" data-type="markdown"><pre>a</pre><div><p>a</p></div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/math\na\n~~~')), [['<aside class="example" data-type="math"><pre>a</pre><div class="math notranslate">$$\na\n$$</div></aside>'], '']);
    });

  });

});
