import { example } from './example';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = some(example);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~example/\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~~example/a\n~~~')), [['<pre class="invalid" translate="no">~~~example/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown a\n~~~')), [['<pre class="invalid" translate="no">~~~example/markdown a\n~~~</pre>'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\na\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><section><p>a</p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n++a\nb++\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">++a\nb++</pre><hr><section><p><ins>a<br>b</ins></p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n$fig-a\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">$fig-a\n!https://host</pre><hr><section><figure data-type="media" data-label="fig-a" data-group="fig" data-number="1" id="label:random:fig-a"><figcaption><span class="figindex">Fig. 1. </span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n[$fig-a]\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">[$fig-a]\n!https://host</pre><hr><section><figure data-type="media" data-label="fig-a" data-group="fig" data-number="1" id="label:random:fig-a"><figcaption><span class="figindex">Fig. 1. </span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n## a\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">## a</pre><hr><section><h2 id="index:random:a" class="local">a</h2><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n~ a\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">~ a</pre><hr><section><dl><dt id="index:random:a" class="local">a</dt><dd></dd></dl><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/markdown\n((a))[[b]]\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">((a))[[b]]</pre><hr><section><p><sup class="annotation local" id="annotation:random:ref:a:1" title="a"><a href="#annotation:random:def:a:1">*1</a></sup><sup class="reference local" id="reference:random:ref:b:1" title="b"><a href="#reference:random:def:b">[1]</a></sup></p><ol class="annotations"><li id="annotation:random:def:a:1" data-marker="*1"><span>a</span><sup><a href="#annotation:random:ref:a:1">^1</a></sup></li></ol><h2>References</h2><ol class="references"><li id="reference:random:def:b"><span>b</span><sup><a href="#reference:random:ref:b:1">^1</a></sup></li></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~~example/markdown\na\n~~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><section><p>a</p><h2>References</h2><ol class="references"></ol></section></aside>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~example/math\na\n~~~')), [['<aside class="example" data-type="math"><pre translate="no">a</pre><hr><div class="math" translate="no">$$\na\n$$</div></aside>'], '']);
    });

  });

});
