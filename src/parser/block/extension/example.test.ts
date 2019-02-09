import { example } from './example';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/example', () => {
  describe('example', () => {
    const parser = some(example);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~~~\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~example/markdown\na\n~~~')), undefined);
      assert(!parser('~~~example/markdown\n' + '\n'.repeat(100) + '~~~'));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n~~~')), [['<aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n\n~~~')), [['<aside class="example" data-type="markdown"><pre></pre><div></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\na\n~~~')), [['<aside class="example" data-type="markdown"><pre>a</pre><div><p>a</p></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n*a\nb*\n~~~')), [['<aside class="example" data-type="markdown"><pre>*a\nb*</pre><div><p><em>a<span class="linebreak"> </span>b</em></p></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n[:fig-a]\n!https://host\n~~~')), [['<aside class="example" data-type="markdown"><pre>[:fig-a]\n!https://host</pre><div><figure data-label="fig-a" data-group="fig" data-index="1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/markdown\n((a))[[b]]\n~~~')), [['<aside class="example" data-type="markdown"><pre>((a))[[b]]</pre><div><p><sup class="annotation" title="a"><a href="#annotation-def:1" rel="noopener" onclick="return false;">*1</a></sup><sup class="authority" title="b"><a href="#authority-def:1" rel="noopener" onclick="return false;">[1]</a></sup></p></div><ol><li>a<sup><a href="#annotation-ref:1" rel="noopener" onclick="return false;">↩1</a></sup></li></ol><ol><li>b<sup><a href="#authority-ref:1" rel="noopener" onclick="return false;">↩1</a></sup></li></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~example/markdown\na\n~~~~')), [['<aside class="example" data-type="markdown"><pre>a</pre><div><p>a</p></div><ol></ol><ol></ol></aside>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~example/math\na\n~~~')), [['<aside class="example" data-type="math"><pre>a</pre><div class="math notranslate">$$\na\n$$</div></aside>'], '']);
      assert(parser('~~~example/markdown\n' + '\n'.repeat(99) + '~~~'));
    });

  });

});
