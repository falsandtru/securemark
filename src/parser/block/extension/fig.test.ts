import { fig } from './fig';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/fig', () => {
  describe('fig', () => {
    const parser = some(fig);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('\n!https://host\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\nhttps://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\nhttps://host\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n !https://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n\n!https://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]a\nhttps://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]a\n!https://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name] a\nhttps://host', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('[$group-name] a\n!https://host', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group" class="invalid"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$-a\n$-b', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' [$group-name]\n!https://host\n', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n!https://host', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n!https://host\n', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n|\n|-\n|', new Context())), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n|\n|-\n|\n', new Context())), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n```\n\n```', new Context())), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><pre class="text"></pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n```\n\n```\n', new Context())), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><pre class="text"></pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n```\n~~~\n```', new Context())), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><pre class="text">~~~</pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n$$\n\n$$', new Context())), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n$$\n\n$$\n', new Context())), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n~~~\n~~~', new Context())), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n~~~\n~~~\n', new Context())), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n~~~example/markdown\n~~~', new Context())), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n~~~example/markdown\n~~~\n', new Context())), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><h2>References</h2><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n~~~table\n~~~', new Context())), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n~~~table\n~~~\n', new Context())), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><table></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n> ', new Context())), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n> \n', new Context())), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n!> *a*', new Context())), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><blockquote><section><p><em>a</em></p><h2>References</h2><ol class="references"></ol></section></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n![]{https://host}', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n![]{https://host}\n', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n!https://host\ncaption', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext">caption</span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('[$group-name]\n!https://host\ncaption\n', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext">caption</span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser, input('$group-name\n!https://host', new Context())), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span><span class="figtext"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt="https://host"></a></div></figure>'], '']);
    });

  });

});
