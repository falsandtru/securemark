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
            '<figure class="label:fig-a" data-type="fig" data-index="1" id="label:fig-1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.</span><span></span></figcaption></figure>',
            '<p><a href="#label:fig-1" rel="noopener" class="label:fig-a">Fig. 1</a></p>',
            '<p><a href="#label:fig-1" rel="noopener" class="label:fig-a">Fig. 1</a></p>',
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
            '<figure class="label:fig-a" data-type="fig" data-index="1" id="label:fig-1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.</span><span></span></figcaption></figure>',
            '<figure class="label:table-a" data-type="table" data-index="1" id="label:table-1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Table. 1.</span><span></span></figcaption></figure>',
            '<figure class="label:fig-b" data-type="fig" data-index="2" id="label:fig-2"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 2.</span><span></span></figcaption></figure>',
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
            '<figure class="label:fig-a-0.0" data-type="fig" data-index="1" id="label:fig-1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.</span><span></span></figcaption></figure>',
            '<figure class="label:fig-b-0.0.0.0" data-type="fig" data-index="1.0.0.1" id="label:fig-1.0.0.1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.0.0.1.</span><span></span></figcaption></figure>',
            '<figure class="label:fig-c-0.0" data-type="fig" data-index="1.1" id="label:fig-1.1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.1.</span><span></span></figcaption></figure>',
            '<figure class="label:fig-d" data-type="fig" data-index="2" id="label:fig-2"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 2.</span><span></span></figcaption></figure>',
            '<p><a href="#label:fig-1.0.0.1" rel="noopener" class="label:fig-b">Fig. 1.0.0.1</a></p>',
          ]);
      }
    });

    it('fixed', () => {
      const source = parse([
        '~~~figure [:fig-1]\n!https://host\n~~~',
        '~~~figure [:fig-1.1]\n!https://host\n~~~',
        '[:fig-1.1]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure class="label:fig-1" data-type="fig" data-index="1" id="label:fig-1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.</span><span></span></figcaption></figure>',
            '<figure class="label:fig-1.1" data-type="fig" data-index="1.1" id="label:fig-1.1"><a href="https://host" rel="noopener" target="_blank"><img class="media" data-src="https://host" alt=""></a><figcaption><span>Fig. 1.1.</span><span></span></figcaption></figure>',
            '<p><a href="#label:fig-1.1" rel="noopener" class="label:fig-1.1">Fig. 1.1</a></p>',
          ]);
      }
    });

    it('number', () => {
      const source = parse([
        '~~~figure [:$-a]\n$$\nLaTeX\n$$\n\n~~~',
        '[:$-a]',
      ].join('\n\n'));
      figure(source);
      assert.deepStrictEqual(
        [...source.children].map(el => el.outerHTML),
        [
          '<figure class="label:$-a" data-type="$" data-index="1" id="label:$-1"><div class="math notranslate">$$\nLaTeX\n$$</div><figcaption><span>(1)</span><span></span></figcaption></figure>',
          '<p><a href="#label:$-1" rel="noopener" class="label:$-a">(1)</a></p>',
        ]);
    });

  });

});
