import { fig } from './fig';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/fig', () => {
  describe('fig', () => {
    const parser = some(fig);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('\n!https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:type-name]\nhttps://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n!https://host\na\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n !https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n\n!https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' [:type-name]\n!https://host\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[:type-name]\n!https://host\n')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n|\n|-\n|\n')), [['<figure class="label:type-name" data-type="type"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n```\n\n```\n')), [['<figure class="label:type-name" data-type="type"><pre class="notranslate"></pre><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n```\n~~~\n```\n')), [['<figure class="label:type-name" data-type="type"><pre class="notranslate">~~~</pre><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n$$\n\n$$\n')), [['<figure class="label:type-name" data-type="type"><div class="math notranslate">$$\n\n$$</div><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n> \n')), [['<figure class="label:type-name" data-type="type"><blockquote></blockquote><figcaption><span></span></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:type-name]\n![](https://host)\n')), [['<figure class="label:type-name" data-type="type"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span></span></figcaption></figure>'], '']);
    });

  });

});
