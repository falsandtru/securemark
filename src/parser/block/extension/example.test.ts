import { example } from './example';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = some(example);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~~~\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~example/markdown\na\n~~~')), undefined);
      assert(!parser('~~~example/markdown\n' + '\n'.repeat(101) + '~~~'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~~~')), [['<aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n\n~~~')), [['<aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~')), [['<aside class="example" data-type="markdown"><pre>a</pre><div><p>a</p></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n*a\nb*\n~~~')), [['<aside class="example" data-type="markdown"><pre>*a\nb*</pre><div><p><em>a<br>b</em></p></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n$fig-a\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre>$fig-a\n!https://host</pre><div><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n[$fig-a]\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre>[$fig-a]\n!https://host</pre><div><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n## a\n~~~')), [['<aside class="example" data-type="markdown"><pre>## a</pre><div><h2>a</h2></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~ a\n~~~')), [['<aside class="example" data-type="markdown"><pre>~ a</pre><div><dl><dt>a</dt><dd></dd></dl></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n((a))[[b]]\n~~~')), [['<aside class="example" data-type="markdown"><pre>((a))[[b]]</pre><div><p><sup class="annotation" title="a"><a rel="noopener">*1</a></sup><sup class="authority" title="b"><a rel="noopener">[1]</a></sup></p></div><ol><li class="footnote">a<sup><a rel="noopener">~1</a></sup></li></ol><ol><li class="footnote">b<sup><a rel="noopener">~1</a></sup></li></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~~')), [['<aside class="example" data-type="markdown"><pre>a</pre><div><p>a</p></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/math\na\n~~~')), [['<aside class="example" data-type="math"><pre>a</pre><div class="math notranslate">$$\na\n$$</div></aside>'], '']);
      assert(parser('~~~example/markdown\n' + '\n'.repeat(100) + '~~~'));
    });

  });

});
