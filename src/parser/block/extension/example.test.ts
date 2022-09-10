import { example } from './example';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = (source: string) => some(example)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~example/a\n~~~')), [['<pre class="invalid" translate="no">~~~example/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown a\n~~~')), [['<pre class="invalid" translate="no">~~~example/markdown a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~example/markdown\n0${'\n'.repeat(301)}~~~`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><section><p>a</p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n_a\nb_\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">_a\nb_</pre><hr><section><p><em>a<br>b</em></p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n$fig-a\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">$fig-a\n!https://host</pre><hr><section><figure data-type="media" data-label="fig-a" data-group="fig" data-number="1"><figcaption><span class="figindex">Fig. 1. </span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n[$fig-a]\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">[$fig-a]\n!https://host</pre><hr><section><figure data-type="media" data-label="fig-a" data-group="fig" data-number="1"><figcaption><span class="figindex">Fig. 1. </span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n## a\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">## a</pre><hr><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~ a\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">~ a</pre><hr><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n((a))[[b]]\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">((a))[[b]]</pre><hr><section><p><sup class="annotation disabled" title="a"><span hidden="">a</span><a>*1</a></sup><sup class="reference disabled" title="b"><span hidden="">b</span><a>[1]</a></sup></p><ol class="annotations"><li data-marker="*1">a<sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"><li>b<sup><a>^1</a></sup></li></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><section><p>a</p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/math\na\n~~~')), [['<aside class="example" data-type="math"><pre translate="no">a</pre><hr><div class="math" translate="no">$$\na\n$$</div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~example/math\n0${'\n'.repeat(100)}~~~`), '>'), [['<aside class="example" data-type="math">'], '']);
    });

  });

});
