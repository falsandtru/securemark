import { fig } from './fig';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/fig', () => {
  describe('fig', () => {
    const parser = (source: string) => some(fig)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('\n!https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\nhttps://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\nhttps://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\na')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n !https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n\n!https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]a\nhttps://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name]a\n!https://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name] a\nhttps://host')), undefined);
      assert.deepStrictEqual(inspect(parser('[$group-name] a\n!https://host')), [['<figure data-type="media" data-label="group-name" data-group="group" class="invalid"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$-a\n$-b')), undefined);
      assert.deepStrictEqual(inspect(parser(' [$group-name]\n!https://host\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host')), [['<figure data-type="media" data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!https://host\n')), [['<figure data-type="media" data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n|\n|-\n|')), [['<figure data-type="table" data-label="group-name" data-group="group"><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n|\n|-\n|\n')), [['<figure data-type="table" data-label="group-name" data-group="group"><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n\n```')), [['<figure data-type="text" data-label="group-name" data-group="group"><div><pre class="text" translate="no"></pre></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n\n```\n')), [['<figure data-type="text" data-label="group-name" data-group="group"><div><pre class="text" translate="no"></pre></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n```\n~~~\n```')), [['<figure data-type="text" data-label="group-name" data-group="group"><div><pre class="text" translate="no">~~~</pre></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n$$\n\n$$')), [['<figure data-type="math" data-label="group-name" data-group="group"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n$$\n\n$$\n')), [['<figure data-type="math" data-label="group-name" data-group="group"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~example/markdown\n~~~')), [['<figure data-type="example" data-label="group-name" data-group="group"><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><ol class="annotations"></ol><ol class="references"></ol></section></aside></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~example/markdown\n~~~\n')), [['<figure data-type="example" data-label="group-name" data-group="group"><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><ol class="annotations"></ol><ol class="references"></ol></section></aside></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~table\n~~~')), [['<figure data-type="table" data-label="group-name" data-group="group"><div><table></table></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n~~~table\n~~~\n')), [['<figure data-type="table" data-label="group-name" data-group="group"><div><table></table></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n> ')), [['<figure data-type="quote" data-label="group-name" data-group="group"><div><blockquote></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n> \n')), [['<figure data-type="quote" data-label="group-name" data-group="group"><div><blockquote></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n>\n~~~')), [['<figure data-type="quote" data-label="group-name" data-group="group"><div><blockquote><pre><br>~~~</pre></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n!> *a*')), [['<figure data-type="quote" data-label="group-name" data-group="group"><div><blockquote><section><p><em>a</em></p><ol class="annotations"></ol><ol class="references"></ol></section></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n![]{https://host}')), [['<figure data-type="media" data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[$group-name]\n![]{https://host}\n')), [['<figure data-type="media" data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('$group-name\n!https://host')), [['<figure data-type="media" data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
    });

  });

});
