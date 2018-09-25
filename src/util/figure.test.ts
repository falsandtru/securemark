import { figure } from './figure';
import { parse } from '../parser';

describe('Unit: util/figure', () => {
  describe('figure', () => {
    it('empty', () => {
      const source = parse('');
      figure(source);
      assert.deepStrictEqual(
        [...source.children].map(el => el.outerHTML),
        []);
    });

    it('one', () => {
      const source = parse([
        '~~~figure [:fig-a]\n!https://host\n~~~',
        '[:fig-a]',
        '[:fig-a]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<p><a href="#label:fig-1" rel="noopener" class="label" data-label="fig-a">Fig. 1</a></p>',
            '<p><a href="#label:fig-1" rel="noopener" class="label" data-label="fig-a">Fig. 1</a></p>',
          ]);
      }
    });

    it('some', () => {
      const source = parse([
        '~~~figure [:fig-a]\n!https://host\n~~~',
        '~~~figure [:table-a]\n!https://host\n~~~',
        '~~~figure [:fig-b]\n!https://host\n~~~',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="table-a" data-group="table" data-index="1" id="label:table-1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Table. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b" data-group="fig" data-index="2" id="label:fig-2"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 2.</span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('group', () => {
      const source = parse([
        '~~~figure [:fig-a-0.0]\n!https://host\n~~~',
        '~~~figure [:fig-b-0.0.0.0]\n!https://host\n~~~',
        '~~~figure [:fig-c-0.0]\n!https://host\n~~~',
        '~~~figure [:fig-d]\n!https://host\n~~~',
        '[:fig-b]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a-0.0" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b-0.0.0.0" data-group="fig" data-index="1.0.0.1" id="label:fig-1.0.0.1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.0.0.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-c-0.0" data-group="fig" data-index="1.1" id="label:fig-1.1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-d" data-group="fig" data-index="2" id="label:fig-2"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 2.</span><figcaption></figcaption></figure>',
            '<p><a href="#label:fig-1.0.0.1" rel="noopener" class="label" data-label="fig-b">Fig. 1.0.0.1</a></p>',
          ]);
      }
    });

    it('fixed', () => {
      const source = parse([
        '~~~figure [:fig-1]\n!https://host\n~~~',
        '~~~figure [:fig-a-0.0]\n!https://host\n~~~',
        '~~~figure [:$-2.1]\n$$\nLaTeX\n$$\n~~~',
        '[:$-2.1]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-1" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-a-0.0" data-group="fig" data-index="1.1" id="label:fig-1.1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="$-2.1" data-group="$" data-index="2.1" id="label:$-2.1"><div class="figcontent"><div class="math notranslate">$$\nLaTeX\n$$</div></div><span class="figindex">(2.1)</span><figcaption></figcaption></figure>',
            '<p><a href="#label:$-2.1" rel="noopener" class="label" data-label="$-2.1">(2.1)</a></p>',
          ]);
      }
    });

    it('number', () => {
      const source = parse([
        '~~~figure [:$-a]\n$$\nLaTeX\n$$\n~~~',
        '[:$-a]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="$-a" data-group="$" data-index="1" id="label:$-1"><div class="figcontent"><div class="math notranslate">$$\nLaTeX\n$$</div></div><span class="figindex">(1)</span><figcaption></figcaption></figure>',
            '<p><a href="#label:$-1" rel="noopener" class="label" data-label="$-a">(1)</a></p>',
          ]);
      }
    });

    it('separation', () => {
      const source = parse([
        '!>> ~~~figure [:fig-1]\n!https://host\n~~~\n> ~~~figure [:fig-a]\n!https://host\n~~~',
        '~~~~example/markdown\n~~~figure [:fig-a]\n!https://host\n~~~\n~~~~',
        '~~~figure [:fig-a]\n!https://host\n~~~',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><figure data-label="fig-1" data-group="fig" data-index="1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure></blockquote><figure data-label="fig-0" data-group="fig" data-index="0"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 0.</span><figcaption></figcaption></figure></blockquote>',
            '<aside class="example" data-type="markdown"><pre>~~~figure [:fig-a]\n!https://host\n~~~</pre><div><figure data-label="fig-a" data-group="fig" data-index="1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure></div><ol></ol><ol></ol></aside>',
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
          ]);
      }
    });

  });

});
