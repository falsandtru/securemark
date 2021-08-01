import { example } from './example';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = (source: string) => some(example)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~example/a\n~~~')), [['<pre class="invalid" translate="no">~~~example/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown a\n~~~')), [['<pre class="invalid" translate="no">~~~example/markdown a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~example/markdown\n0${'\n'.repeat(301)}~~~`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><div></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><div></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no"></pre><hr><div></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><div><p>a</p></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n*a\nb*\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">*a\nb*</pre><hr><div><p><em>a<br>b</em></p></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n$fig-a\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">$fig-a\n!https://host</pre><hr><div><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1: </span><figcaption></figcaption></figure></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n[$fig-a]\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">[$fig-a]\n!https://host</pre><hr><div><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1: </span><figcaption></figcaption></figure></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n## a\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">## a</pre><hr><div><h2>a</h2></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~ a\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">~ a</pre><hr><div><dl><dt>a</dt><dd></dd></dl></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n((a))[[b]]\n~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">((a))[[b]]</pre><hr><div><p><sup class="annotation disabled" title="a"><a>*1</a></sup><sup class="reference disabled" title="b"><a>[1]</a></sup></p></div><ol class="annotation"><li>a<sup><a>~1</a></sup></li></ol><ol class="reference"><li>b<sup><a>~1</a></sup></li></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~~')), [['<aside class="example" data-type="markdown"><pre translate="no">a</pre><hr><div><p>a</p></div><ol class="annotation"></ol><ol class="reference"></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/math\na\n~~~')), [['<aside class="example" data-type="math"><pre translate="no">a</pre><hr><div class="math" translate="no">$$\na\n$$</div></aside>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~example/math\n0${'\n'.repeat(100)}~~~`), '>'), [['<aside class="example" data-type="math">'], '']);
    });

  });

});
