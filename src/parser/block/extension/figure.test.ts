import { figure } from './figure';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figure', () => {
  describe('figure', () => {
    const parser = some(figure);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n\n\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n !https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:$-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:$-name]\n$$\n\n$$\n\ncaption\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~figure [:group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~figure [:group-name]\n!https://host\n~~~')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n~~~\n')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n*caption*\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption><em>caption</em></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n|\n|-\n|\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n```\n\n```\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="notranslate"></pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n```\n~~~\n```\n\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><pre class="notranslate">~~~</pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n$$\n\n$$\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n$$\n\n$$\n\ncaption\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption>caption</figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n~~~example/markdown\n~~~\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n> \n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n![]{https://host}\n~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-1.0]\n> \n~~~')), [['<figure data-label="group-1.0" data-group="group" style="display: none;"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [:group-name]\n!https://host\n~~~~')), [['<figure data-label="group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
    });

  });

});
