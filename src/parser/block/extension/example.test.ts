import { example } from './example';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = some(example);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~example/\n~~~', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~~example/a\n~~~', new Context())), [['<pre class="invalid" translate="no">~~~example/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown a\n~~~', new Context())), [['<pre class="invalid" translate="no">~~~example/markdown a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`~~~example/markdown\n0${'\n'.repeat(301)}~~~`, new Context()), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\na\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><section><p>a</p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n++a\nb++\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">++a\nb++</pre><hr><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n$fig-a\n!https://host\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">$fig-a\n!https://host</pre><hr><section><figure data-type="media" data-label="fig-a" data-group="fig" data-number="1"><figcaption><span class="figindex">Fig. 1. </span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n[$fig-a]\n!https://host\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">[$fig-a]\n!https://host</pre><hr><section><figure data-type="media" data-label="fig-a" data-group="fig" data-number="1"><figcaption><span class="figindex">Fig. 1. </span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n## a\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">## a</pre><hr><section><h2>a</h2><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n~ a\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">~ a</pre><hr><section><dl><dt>a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n((a))[[b]]\n~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">((a))[[b]]</pre><hr><section><p><sup class="annotation disabled" title="a"><a>*1</a></sup><sup class="reference disabled" title="b"><a>[1]</a></sup></p><ol class="annotations"><li data-marker="*1"><span>a</span><sup><a>^1</a></sup></li></ol><h2>References</h2><ol class="references"><li><span>b</span><sup><a>^1</a></sup></li></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~~example/markdown\na\n~~~~', new Context())), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><section><p>a</p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/math\na\n~~~', new Context())), [['<aside class="example" data-type="math"><pre translate="no">a</pre><hr><div class="math" translate="no">$$\na\n$$</div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input(`~~~example/math\n0${'\n'.repeat(100)}~~~`, new Context()), '>'), [['<aside class="example" data-type="math">'], '']);
    });

  });

});
