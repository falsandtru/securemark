﻿import { fig } from './fig';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/fig', () => {
  describe('fig', () => {
    const parser = some(fig);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('\n!https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:group-name]\nhttps://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n!https://host\na\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n !https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n\n!https://host\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' [:group-name]\n!https://host\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('[:group-name]\n!https://host\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n|\n|-\n|\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><table><thead><tr></tr></thead><tbody><tr></tr></tbody></table></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n```\n\n```\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><pre class="notranslate"></pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n```\n~~~\n```\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><pre class="notranslate">~~~</pre></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n$$\n\n$$\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><div class="math notranslate">$$\n\n$$</div></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n~~~example/markdown\n~~~\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n> \n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n!> ~~~\n~~~~\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><blockquote><p>~~~<span class="linebreak"> </span>~~~~</p></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
      assert.deepStrictEqual(inspect(parser('[:group-name]\n![](https://host)\n')), [['<figure class="label:group-name" data-group="group"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex"></span><figcaption></figcaption></figure>'], '']);
    });

  });

});
