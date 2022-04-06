import { figure } from './figure';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figure', () => {
  describe('figure', () => {
    const parser = (source: string) => some(figure)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure $group-name]\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\n\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n !https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~figure [$group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]a\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]a\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name] a\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name] a\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure a[$group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure a [$group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~ [$group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~ $group-name\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~figure [$group-name]\n!https://host\n~~~')), undefined);
      assert(!parser('~~~figure [$group-name]\n```\n0' + '\n'.repeat(301) + '```\n~~~'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~\n')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\\\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>\\</figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n!https://caption\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>!<a href="https://caption" target="_blank">https://caption</a></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n- a\n~~~')), [['<figure data-type="list" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><ul><li>a</li></ul></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n1. a\n~~~')), [['<figure data-type="list" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><ol><li>a</li></ol></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n|\n|-\n|\n~~~')), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n\n```\n~~~')), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><pre class="text" translate="no"></pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n~~~\n```\n\n~~~')), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><pre class="text" translate="no">~~~</pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n```\n\ncaption\n~~~')), [['<figure data-type="text" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>caption</figcaption><div><pre class="text" translate="no"></pre></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n\n$$\n~~~')), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n~~~\n$$\n~~~')), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><div class="math" translate="no">$$\n~~~\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-type="math" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>caption</figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n~~~example/markdown\n~~~\n\ncaption\n~~~')), [['<figure data-type="example" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>caption</figcaption><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><ol class="annotations"></ol><ol class="references"></ol></section></aside></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n~~~table\n~~~\n\ncaption\n~~~')), [['<figure data-type="table" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>caption</figcaption><div><table></table></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n> \n~~~\n\n~~~')), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><blockquote><pre><br>~~~</pre></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n> \n~~~\n\ncaption\n~~~')), [['<figure data-type="quote" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span>caption</figcaption><div><blockquote><pre><br>~~~</pre></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n![]{https://host}\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [$group-name]\n!https://host\n~~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure $group-name\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~[$group-name]\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~$group-name\n!https://host\n~~~')), [['<figure data-type="media" data-label="group-name" data-group="group"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-0]\n> \n\n~~~')), [['<figure data-type="quote" data-label="group-0" data-group="group" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><blockquote></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-0.0]\n> \n\n~~~')), [['<figure data-type="quote" data-label="group-0.0" data-group="group" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><blockquote></blockquote></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-0]\n$$\n\n$$\n~~~')), [['<figure data-type="math" data-label="$-0" data-group="$" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-0.0]\n$$\n\n$$\n~~~')), [['<figure data-type="math" data-label="$-0.0" data-group="$" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-name]\n!https://host\n~~~')), [['<figure data-type="media" data-label="$-name" data-group="$" class="invalid"><figcaption><span class="figindex"></span></figcaption><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-type="math" data-label="$-name" data-group="$" class="invalid"><figcaption><span class="figindex"></span>caption</figcaption><div><div class="math" translate="no">$$\n\n$$</div></div></figure>'], '']);
      assert(parser('~~~figure [$group-name]\n```\n0' + '\n'.repeat(300) + '```\n~~~'));
      assert(parser('~~~figure [$group-name]\n' + '>\n'.repeat(500) + '\n~~~'));
    });

  });

});
