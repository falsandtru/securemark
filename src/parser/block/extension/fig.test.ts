import { fig } from './fig';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/fig', () => {
  describe('fig', () => {
    const parser = (source: string) => some(fig)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('\n!https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\nhttps://host')), [['<pre class="invalid" translate="no">~~~figure [$group-name]\nhttps://host\n\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\nhttps://host\n')), [['<pre class="invalid" translate="no">~~~figure [$group-name]\nhttps://host\n\n\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\na')), [['<pre class="invalid" translate="no">~~~figure [$group-name]\n!https://host\na\n\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n !https://host')), [['<pre class="invalid" translate="no">~~~figure [$group-name]\n !https://host\n\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n\n!https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]a\n!https://host')), [['<pre class="invalid" translate="no">~~~figure [$group-name]a\n!https://host\n\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name] a\n!https://host')), [['<pre class="invalid" translate="no">~~~figure [$group-name] a\n!https://host\n\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(' [$group-name]\n!https://host\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n|\n|-\n|')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n|\n|-\n|\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n\n```')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="text" translate="no"></pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n\n```\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="text" translate="no"></pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n~~~\n```')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="text" translate="no">~~~</pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n$$\n\n$$')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math" translate="no">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n$$\n\n$$\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math" translate="no">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~example/markdown\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><ol class="annotations"></ol><ol class="references"></ol></section></aside></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~example/markdown\n~~~\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><ol class="annotations"></ol><ol class="references"></ol></section></aside></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n> ')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n> \n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n>\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><blockquote><pre><br>~~~</pre></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!> *a*')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><blockquote><section><p><em>a</em></p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n![]{https://host}')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n![]{https://host}\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$group-name\n!https://host')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
    });

  });

});
