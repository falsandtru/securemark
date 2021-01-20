import { figure } from './figure';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figure', () => {
  describe('figure', () => {
    const parser = (source: string) => some(figure)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure\n!https://host\n~~~')), undefined);
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
      assert.deepStrictEqual(inspect(parser(' ~~~figure [$group-name]\n!https://host\n~~~')), undefined);
      assert(!parser('~~~figure [$group-name]\n```\n' + '\n'.repeat(301) + '```\n~~~'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n~~~\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n\\\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n!https://host\n\n!https://caption\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption>!<a href="https://caption" target="_blank">https://caption</a></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n|\n|-\n|\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n\n```\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="notranslate"></pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n```\n~~~\n```\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="notranslate">~~~</pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n\n$$\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n~~~\n$$\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math notranslate">$$\n~~~\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n~~~example/markdown\n~~~\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><aside class="example" data-type="markdown"><pre></pre><hr><div></div><ol class="annotation"></ol><ol class="reference"></ol></aside></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n> \n~~~\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><blockquote><pre><br>~~~</pre></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-name]\n![]{https://host}\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [$group-name]\n!https://host\n~~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure $group-name\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-0]\n> \n\n~~~')), [['<figure data-label="group-0" data-group="group" class="invalid"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$group-0.0]\n> \n\n~~~')), [['<figure data-label="group-0.0" data-group="group" class="invalid"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-0]\n$$\n\n$$\n~~~')), [['<figure data-label="$-0" data-group="$" class="invalid"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-0.0]\n$$\n\n$$\n~~~')), [['<figure data-label="$-0.0" data-group="$" class="invalid"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-name]\n!https://host\n~~~')), [['<figure data-label="$-name" data-group="$" class="invalid"><div class="figcontent"><a href="https://host" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [$-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-label="$-name" data-group="$" class="invalid"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption>caption</figcaption></figure>'], '']);
      assert(parser('~~~figure [$group-name]\n```\n' + '\n'.repeat(300) + '```\n~~~'));
      assert(parser('~~~figure [$group-name]\n' + '>\n'.repeat(500) + '\n~~~'));
    });

  });

});
