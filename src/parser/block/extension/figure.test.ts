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
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n !https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:$-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~figure [:group-name]\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~figure [:group-name]\n!https://host\n~~~')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n~~~')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n~~~\n')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n~~~')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n\n~~~')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n!https://host\n\n*caption*\n~~~')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span><em>caption</em></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n|\n|-\n|\n~~~')), [['<figure class="label:group-name" data-group="group"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n```\n\n```\n~~~')), [['<figure class="label:group-name" data-group="group"><pre class="notranslate"></pre><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n```\n~~~\n```\n\n~~~')), [['<figure class="label:group-name" data-group="group"><pre class="notranslate">~~~</pre><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n$$\n\n$$\n~~~')), [['<figure class="label:group-name" data-group="group"><div class="math notranslate">$$\n\n$$</div><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n~~~example/markdown\n~~~\n~~~')), [['<figure class="label:group-name" data-group="group"><aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n> \n~~~')), [['<figure class="label:group-name" data-group="group"><blockquote></blockquote><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:group-name]\n![](https://host)\n~~~')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [:group-name]\n!https://host\n~~~~')), [['<figure class="label:group-name" data-group="group"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span><span></span></figcaption></figure>'], '']);
    });

  });

});
