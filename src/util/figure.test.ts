import { figure } from './figure';
import { parse } from '../parser';
import { html } from 'typed-dom';

describe('Unit: util/figure', () => {
  describe('figure', () => {
    it('empty', () => {
      const target = parse('');
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          []);
      }
    });

    it('one', () => {
      const target = parse([
        '$fig-a\n> ',
        '$fig-a',
        '$fig-a',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

    it('some', () => {
      const target = parse([
        '$fig-a\n> ',
        '## 0',
        '$table-a\n> ',
        '$fig-b\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="table-a" data-group="table" data-number="1" id="label:table-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Table. 1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b" data-group="fig" data-number="2" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2. </span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('format', () => {
      const target = parse([
        '$fig-a-0.0.0\n> ',
        '$fig-b-0.0\n> ',
        '$fig-c\n> ',
        '$fig-b',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a-0.0.0" data-group="fig" data-number="1.0.1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.0.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b-0.0" data-group="fig" data-number="1.1" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-c" data-group="fig" data-number="2" id="label:fig-c"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2. </span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-b" href="#label:fig-b">Fig. 1.1</a></p>',
          ]);
      }
    });

    it('fixed', () => {
      const target = parse([
        '$fig-2.1\n> ',
        '$fig-a-0.0.0\n> ',
        '$-4.1\n$$\n$$',
        '$-a\n$$\n$$',
        '$fig-b\n> ',
        '$fig-1.0',
        '$-4.1',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-2.1" data-group="fig" data-number="2.1" id="label:fig-2.1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-a-0.0.0" data-group="fig" data-number="2.1.1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2.1.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="$-4.1" data-group="$" data-number="4.1" id="label:$-4.1"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(4.1)</span><figcaption></figcaption></figure>',
            '<figure data-label="$-a" data-group="$" data-number="5" id="label:$-a"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(5)</span><figcaption></figcaption></figure>',
            '<figure data-label="fig-b" data-group="fig" data-number="3" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 3. </span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-1.0">$fig-1.0</a></p>',
            '<p><a rel="noopener" class="label" data-label="$-4.1" href="#label:$-4.1">(4.1)</a></p>',
          ]);
      }
    });

    it('base', () => {
      const target = parse([
        '$-0.0\n> ',
        '## 0',
        '$fig-1\n> ',
        '$fig-a-0.0\n> ',
        '## 0',
        '!> ## 0',
        '$fig-b\n> ',
        '## 0',
        '$-0.0.0\n> ',
        '$quote-a-0.0\n> ',
        '$fig-c\n> ',
        '## 0',
        '$-0.1.0\n> ',
        '$fig-d\n> ',
        '$-0.0\n> ',
        '$-0.1.0\n> ',
        '$-0.4.0\n> ',
        '$-0.1.0\n> ',
        '## 0',
        '## 0',
        '$-0.0\n> ',
        '$fig-e\n> ',
        '$-5.0\n> ',
        '$fig-f\n> ',
        '$-0\n> ',
        '$fig-g\n> ',
        '### 0',
        '$fig-h\n> ',
        '$-0.0.0\n> ',
        '### 0',
        '$fig-i\n> ',
        '# 0',
        '$fig-j\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="$-0.0" data-group="$" style="display: none;" data-number="0.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="fig-1" data-group="fig" data-number="1" id="label:fig-1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-a-0.0" data-group="fig" data-number="1.1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1. </span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<blockquote><h2>0</h2></blockquote>',
            '<figure data-label="fig-b" data-group="fig" data-number="2.1" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2.1. </span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0.0" data-group="$" style="display: none;" data-number="3.0.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="quote-a-0.0" data-group="quote" data-number="3.1" id="label:quote-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Quote. 3.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-c" data-group="fig" data-number="3.0.1" id="label:fig-c"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 3.0.1. </span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.1.0" data-group="$" style="display: none;" data-number="4.1.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="fig-d" data-group="fig" data-number="4.1.1" id="label:fig-d"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 4.1.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="$-0.0" data-group="$" style="display: none;" data-number="4.1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="$-0.1.0" data-group="$" style="display: none;" data-number="4.2.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="$-0.4.0" data-group="$" style="display: none;" data-number="4.4.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="$-0.1.0" data-group="$" style="display: none;" data-number="4.5.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" style="display: none;" data-number="6.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="fig-e" data-group="fig" data-number="6.1" id="label:fig-e"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 6.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="$-5.0" data-group="$" style="display: none;" data-number="5.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="fig-f" data-group="fig" data-number="5.1" id="label:fig-f"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 5.1. </span><figcaption></figcaption></figure>',
            '<figure data-label="$-0" data-group="$" style="display: none;" data-number="0.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<figure data-label="fig-g" data-group="fig" data-number="0.1" id="label:fig-g"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 0.1. </span><figcaption></figcaption></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="fig-h" data-group="fig" data-number="0.2" id="label:fig-h"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 0.2. </span><figcaption></figcaption></figure>',
            '<figure data-label="$-0.0.0" data-group="$" style="display: none;" data-number="0.0.0"><div class="figcontent"><blockquote></blockquote></div><span class="figindex"></span><figcaption></figcaption></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="fig-i" data-group="fig" data-number="0.1.1" id="label:fig-i"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 0.1.1. </span><figcaption></figcaption></figure>',
            '<h1 id="index:0">0</h1>',
            '<figure data-label="fig-j" data-group="fig" data-number="1.1" id="label:fig-j"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1.1. </span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('number', () => {
      const target = parse([
        '$-a\n$$\n$$',
        '$-a',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="$-a" data-group="$" data-number="1" id="label:$-a"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(1)</span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          ]);
      }
    });

    it('separation', () => {
      const target = html('blockquote', parse([
        '!>> ~~~figure $fig-a\n>> > \n>>\n~~~\n> ~~~figure $fig-a\n> > \n>\n~~~',
        '~~~~example/markdown\n~~~figure $fig-a\n> \n\n~~~\n\n$fig-a\n~~~~',
        '~~~figure $fig-b\n> \n\n~~~',
        '~~~figure $fig-a\n> \n\n~~~',
      ].join('\n\n')).children);
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure></blockquote><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure></blockquote>',
            '<aside class="example" data-type="markdown"><pre>~~~figure $fig-a\n&gt; \n\n~~~\n\n$fig-a</pre><div><figure data-label="fig-a" data-group="fig" data-number="1"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure><p><a rel="noopener" class="label" data-label="fig-a">Fig. 1</a></p></div><ol></ol><ol></ol></aside>',
            '<figure data-label="fig-b" data-group="fig" data-number="1" id="label:fig-b"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure>',
            '<figure data-label="fig-a" data-group="fig" data-number="2" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 2. </span><figcaption></figcaption></figure>',
          ]);
      }
    });

    it('verbose', () => {
      const target = parse([
        '~~~figure [$fig-a]\n> \n\n~~~',
        '[$fig-a]',
        '[$fig-a]',
      ].join('\n\n'));
      for (let i = 0; i < 2; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div class="figcontent"><blockquote></blockquote></div><span class="figindex">Fig. 1. </span><figcaption></figcaption></figure>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
            '<p><a rel="noopener" class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

  });

});
