import { figure } from './figure';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figure', () => {
  describe('figure', () => {
    const parser = some(figure);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n !https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~figure [:type-name]\n!https://host\n~~~')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n~~~')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n~~~\n')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\n~~~')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\n\n~~~')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\n*caption*\n~~~')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span><em>caption</em></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n|\n|-\n|\n~~~')), [['<figure class="label:type-name" data-type="type"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n```\n\n```\n~~~')), [['<figure class="label:type-name" data-type="type"><pre class="notranslate"></pre><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n```\n~~~\n```\n\n~~~')), [['<figure class="label:type-name" data-type="type"><pre class="notranslate">~~~</pre><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n$$\n\n$$\n~~~')), [['<figure class="label:type-name" data-type="type"><div class="math notranslate">$$\n\n$$</div><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n~~~example/markdown\n~~~\n~~~')), [['<figure class="label:type-name" data-type="type"><aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n> \n~~~')), [['<figure class="label:type-name" data-type="type"><blockquote></blockquote><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n![](https://host)\n~~~')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [:type-name]\n!https://host\n~~~~')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
    });

  });

});
