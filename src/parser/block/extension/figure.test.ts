import { some } from '../../../combinator';
import { figure } from './figure';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/figure', () => {
  describe('figure', () => {
    const parser = some(figure);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\nhttps://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\\\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n !https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n\n!https://host\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~figure [:type-name]\n!https://host\n~~~')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n~~~')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n~~~\n')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\n~~~')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\n\n~~~')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n!https://host\n\n*caption*\n~~~')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span><em>caption</em></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n|\n|-\n|\n~~~')), [['<figure class="label:type-name"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n$$\na\n$$\n~~~')), [['<figure class="label:type-name"><div class="math notranslate">$$\na\n$$</div><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n```\n```\n~~~')), [['<figure class="label:type-name"><pre class="notranslate"></pre><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n```\n~~~\n```\n~~~')), [['<figure class="label:type-name"><pre class="notranslate">~~~</pre><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n> \n~~~')), [['<figure class="label:type-name"><blockquote></blockquote><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n![](https://host)\n~~~')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~figure [:type-name]\n![\\(\\(]((https://host/]((a))((b )) \n~~~')), [['<figure class="label:type-name"><a href="https://host/]((a))((b" rel="noopener" target="_blank"><img class="media" data-src="https://host/]((a))((b" alt="(("></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~figure [:type-name]\n!https://host\n~~~~')), [['<figure class="label:type-name"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption data-type="type"><span></span></figcaption></figure>'], '']);
    });

  });

});
