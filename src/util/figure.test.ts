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
        '$fig-a\n> ',
        '$fig-a',
        '$fig-a',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

    it('some', () => {
      const source = parse([
        '$fig-a\n> ',
        '$table-a\n> ',
        '$fig-b\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="table-a" data-group="table" data-index="1" id="label:table-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Table. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b" data-group="fig" data-index="2" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2.</span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('group', () => {
      const source = parse([
        '$fig-a-0.0\n> ',
        '$fig-b-0.0.0.0\n> ',
        '$fig-c-0.0.0\n> ',
        '$fig-d\n> ',
        '$fig-b',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a-0.0" data-group="fig" data-index="1.1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b-0.0.0.0" data-group="fig" data-index="1.1.1.1" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1.1.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-c-0.0.0" data-group="fig" data-index="1.1.2" id="label:fig-c"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1.2.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-d" data-group="fig" data-index="1.1.3" id="label:fig-d"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1.3.</span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-b" href="#label:fig-b">Fig. 1.1.1.1</a></p>',
          ]);
      }
    });

    it('fixed', () => {
      const source = parse([
        '$fig-1\n> ',
        '$fig-a-0.0\n> ',
        '$-3.1\n$$\n$$',
        '$fig-2.0',
        '$-3.1',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-1" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-a-0.0" data-group="fig" data-index="1.1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="$-3.1" data-group="$" data-index="3.1" id="label:$-3.1"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(3.1)</span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-2.0">$fig-2.0</a></p>',
            '<p><a rel="noopener" class="label" data-label="$-3.1" href="#label:$-3.1">(3.1)</a></p>',
          ]);
      }
    });

    it('base', () => {
      const source = parse([
        '$-0.0\n$$\n$$',
        '## 0',
        '$fig-1\n> ',
        '$fig-a-0.0\n> ',
        '## 0',
        '!> ## 0',
        '$fig-b\n> ',
        '## 0',
        '$-0.0.0\n$$\n$$',
        '$quote-a-0.0\n> ',
        '$fig-c\n> ',
        '## 0',
        '$-0.1.0\n$$\n$$',
        '$fig-d\n> ',
        '## 0',
        '## 0',
        '$fig-e\n> ',
        '$-5.0\n$$\n$$',
        '$fig-d\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="$-0.0" data-group="$" style="display: none;" data-index="0.0"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(0.0)</span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="fig-1" data-group="fig" data-index="1" id="label:fig-1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-a-0.0" data-group="fig" data-index="1.1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1.</span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<blockquote><h2>0</h2></blockquote>',
            '<figure data-label="fig-b" data-group="fig" data-index="2.1" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2.1.</span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0.0" data-group="$" style="display: none;" data-index="3.0.0"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(3.0.0)</span><figcaption></figcaption></figure>',
            '<figure data-label="quote-a-0.0" data-group="quote" data-index="3.1" id="label:quote-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Quote. 3.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-c" data-group="fig" data-index="3.0.1" id="label:fig-c"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 3.0.1.</span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.1.0" data-group="$" style="display: none;" data-index="4.1.0"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(4.1.0)</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-d" data-group="fig" data-index="4.1.1" id="label:fig-d"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 4.1.1.</span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="fig-e" data-group="fig" data-index="6.1" id="label:fig-e"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 6.1.</span><figcaption></figcaption></figure>',
            '<figure data-label="$-5.0" data-group="$" style="display: none;" data-index="5.0"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(5.0)</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-d" data-group="fig" data-index="5.1" id="label:fig-d"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 5.1.</span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('number', () => {
      const source = parse([
        '$-a\n$$\n$$',
        '$-a',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="$-a" data-group="$" data-index="1" id="label:$-a"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(1)</span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          ]);
      }
    });

    it('separation', () => {
      const source = parse([
        '!>> ~~~figure $fig-1\n>> > \n>>\n~~~\n> ~~~figure $fig-a\n> > \n>\n~~~',
        '~~~~example/markdown\n~~~figure $fig-a\n> \n\n~~~\n~~~~',
        '~~~figure $fig-a\n> \n\n~~~',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><figure data-label="fig-1" data-group="fig" data-index="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure></blockquote><figure data-label="fig-0" data-group="fig" data-index="0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 0.</span><figcaption></figcaption></figure></blockquote>',
            '<aside class="example" data-type="markdown"><pre>~~~figure $fig-a\n&gt; \n\n~~~</pre><div><figure data-label="fig-a" data-group="fig" data-index="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure></div><ol></ol><ol></ol></aside>',
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('verbose', () => {
      const source = parse([
        '~~~figure [$fig-a]\n> \n\n~~~',
        '[$fig-a]',
        '[$fig-a]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        figure(source);
        assert.deepStrictEqual(
          [...source.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-index="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.</span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

  });

});
