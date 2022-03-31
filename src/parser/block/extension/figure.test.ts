import { figure } from './figure';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figure', () => {
  describe('figure', () => {
    const parser = (source: string) => some(figure)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure $group-name]\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group" class="invalid"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
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
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]a\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group" class="invalid"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name] a\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name] a\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group" class="invalid"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~ [$group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~ $group-name\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~figure [$group-name]\n!https://host\n~~~')), undefined);
      assert(!parser('~~~figure [$group-name]\n```\n0' + '\n'.repeat(301) + '```\n~~~'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~\n')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\\\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span>\\</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n!https://caption\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span>!<a href="https://caption" target="_blank">https://caption</a></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n|\n|-\n|\n~~~')), [['<figure data-label="group-name" data-group="group"><div><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n\n```\n~~~')), [['<figure data-label="group-name" data-group="group"><div><pre class="text" translate="no"></pre></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n~~~\n```\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div><pre class="text" translate="no">~~~</pre></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n```\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div><pre class="text" translate="no"></pre></div><figcaption><span class="figindex"></span>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n\n$$\n~~~')), [['<figure data-label="group-name" data-group="group"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n~~~\n$$\n~~~')), [['<figure data-label="group-name" data-group="group"><div><div class="math" translate="no">$$\n~~~\n$$</div></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n~~~example/markdown\n~~~\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div><aside class="example" data-type="markdown"><pre translate="no"></pre><hr><section><ol class="annotations"></ol><ol class="references"></ol></section></aside></div><figcaption><span class="figindex"></span>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n~~~table\n~~~\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div><table></table></div><figcaption><span class="figindex"></span>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n> \n~~~\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div><blockquote><pre><br>~~~</pre></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n> \n~~~\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div><blockquote><pre><br>~~~</pre></blockquote></div><figcaption><span class="figindex"></span>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n![]{https://host}\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [$group-name]\n!https://host\n~~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure $group-name\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~[$group-name]\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~$group-name\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-0]\n> \n\n~~~')), [['<figure data-label="group-0" data-group="group" class="invalid"><div><blockquote></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-0.0]\n> \n\n~~~')), [['<figure data-label="group-0.0" data-group="group" class="invalid"><div><blockquote></blockquote></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-0]\n$$\n\n$$\n~~~')), [['<figure data-label="$-0" data-group="$" class="invalid"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-0.0]\n$$\n\n$$\n~~~')), [['<figure data-label="$-0.0" data-group="$" class="invalid"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-name]\n!https://host\n~~~')), [['<figure data-label="$-name" data-group="$" class="invalid"><div><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><figcaption><span class="figindex"></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-label="$-name" data-group="$" class="invalid"><div><div class="math" translate="no">$$\n\n$$</div></div><figcaption><span class="figindex"></span>caption</figcaption></figure>'], '']);
      assert(parser('~~~figure [$group-name]\n```\n0' + '\n'.repeat(300) + '```\n~~~'));
      assert(parser('~~~figure [$group-name]\n' + '>\n'.repeat(500) + '\n~~~'));
    });

  });

});
