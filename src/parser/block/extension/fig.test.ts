import { fig } from './fig';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/fig', () => {
  describe('fig', () => {
    const parser = (source: string) => some(fig)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('\n!https://host\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\nhttps://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\nhttps://host\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n !https://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n\n!https://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]a\nhttps://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]a\n!https://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name] a\nhttps://host'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name] a\n!https://host'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group" class="invalid"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$-a\n$-b'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' [$group-name]\n!https://host\n'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\n'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n|\n|-\n|'), ctx), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n|\n|-\n|\n'), ctx), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n\n```'), ctx), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><pre class="text"></pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n\n```\n'), ctx), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><pre class="text"></pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n~~~\n```'), ctx), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><pre class="text">~~~</pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n$$\n\n$$'), ctx), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n$$\n\n$$\n'), ctx), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~\n~~~'), ctx), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~\n~~~\n'), ctx), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~example/markdown\n~~~'), ctx), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~example/markdown\n~~~\n'), ctx), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~table\n~~~'), ctx), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~table\n~~~\n'), ctx), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n> '), ctx), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n> \n'), ctx), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n>\n~~~'), ctx), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote><pre><br>~~~</pre></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!> *a*'), ctx), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote><section><p><em>a</em></p><h2>References</h2><ol class="references"></ol></section></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n![]{https://host}'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n![]{https://host}\n'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\ncaption'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext">caption</span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\ncaption\n'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext">caption</span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$group-name\n!https://host'), ctx), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
    });

  });

});
