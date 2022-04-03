import { figure } from './figure';
import { parse as parse_ } from '../../parser';
import { html } from 'typed-dom';
import { normalize } from '../../debug.test';

const parse = (s: string) => parse_(s, { test: true });

describe('Unit: parser/processor/figure', () => {
  describe('figure', () => {
    it('empty', () => {
      const target = parse('');
      for (let i = 0; i < 3; ++i) {
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
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<p><a class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
            '<p><a class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

    it('some', () => {
      const target = parse([
        '$fig-a\n> ',
        '## 0',
        '$fig-b\n> ',
        '$table-a\n> ',
        '$fig-b\n> ',
        '$fig-c\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-type="quote" data-label="fig-b" data-group="fig" data-number="2" id="label:fig-b"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 2. </span></figcaption></figure>',
            '<figure data-type="quote" data-label="table-a" data-group="table" data-number="1" id="label:table-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Table 1. </span></figcaption></figure>',
            '<figure data-type="quote" data-label="fig-b" data-group="fig" data-number="3" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Duplicate label"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 3. </span></figcaption></figure>',
            '<figure data-type="quote" data-label="fig-c" data-group="fig" data-number="4" id="label:fig-c"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 4. </span></figcaption></figure>',
          ]);
      }
    });

    it('number', () => {
      const target = parse([
        '$-a\n$$\n$$',
        '$-a',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><div><div class="math" translate="no">$$\n$$</div></div><figcaption><span class="figindex">(1)</span></figcaption></figure>',
            '<p><a class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          ]);
      }
    });

    it('fixed', () => {
      const target = parse([
        '$fig-2\n> ',
        '$fig-3.1\n> ',
        '$-4.1.1\n$$\n$$',
        '$-a\n$$\n$$',
        '$fig-a\n> ',
        '$fig-2',
        '$-4.1.1',
        '$fig-1',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="fig-2" data-group="fig" data-number="2" id="label:fig-2"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 2. </span></figcaption></figure>',
            '<figure data-type="quote" data-label="fig-3.1" data-group="fig" data-number="3.1" id="label:fig-3.1"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 3.1. </span></figcaption></figure>',
            '<figure data-type="math" data-label="$-4.1.1" data-group="$" data-number="4.1.1" id="label:$-4.1.1"><div><div class="math" translate="no">$$\n$$</div></div><figcaption><span class="figindex">(4.1.1)</span></figcaption></figure>',
            '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><div><div class="math" translate="no">$$\n$$</div></div><figcaption><span class="figindex">(1)</span></figcaption></figure>',
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<p><a class="label" data-label="fig-2" href="#label:fig-2">Fig. 2</a></p>',
            '<p><a class="label" data-label="$-4.1.1" href="#label:$-4.1.1">(4.1.1)</a></p>',
            '<p><a class="label disabled invalid" data-label="fig-1" data-invalid-syntax="label" data-invalid-type="reference" data-invalid-message="Missing the target figure">$fig-1</a></p>',
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
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><section><figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure><ol class="annotations"></ol><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>',
            '<aside class="example" data-type="markdown"><pre translate="no">~~~figure $fig-a\n&gt; \n\n~~~\n\n$fig-a</pre><hr><section><figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure><p><a class="label disabled" data-label="fig-a">Fig. 1</a></p><ol class="annotations"></ol><ol class="references"></ol></section></aside>',
            '<figure data-type="quote" data-label="fig-b" data-group="fig" data-number="1" id="label:fig-b"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="2" id="label:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 2. </span></figcaption></figure>',
          ]);
      }
    });

    it('base', () => {
      const target = parse([
        '# 0',
        '$-0.0',
        '## 0',
        '$fig-1\n> ',
        '## 0',
        '!> ## 0',
        '$fig-b\n> ',
        '## 0',
        '$-0.0.0',
        '### 0',
        '$-0.0',
        '$fig-c\n> ',
        '## 0',
        '$-0.1.0',
        '$fig-d\n> ',
        '$-0.0',
        '$-0.1.0',
        '$-0.4.0',
        '$-0.1.0',
        '## 0',
        '## 0',
        '$-0.0',
        '$fig-e\n> ',
        '## 0',
        '$-5.0',
        '$fig-f\n> ',
        '$-0',
        '$fig-g\n> ',
        '### 0',
        '$-0.0.0',
        '$fig-h\n> ',
        '### 0',
        '$fig-i\n> ',
        '# 0',
        '$fig-j\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => normalize(el.outerHTML)),
          [
            '<h1 id="index:0">0</h1>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="0.0"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-type="quote" data-label="fig-1" data-group="fig" data-number="1" id="label:fig-1"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<blockquote><section><h2>0</h2><ol class="annotations"></ol><ol class="references"></ol></section></blockquote>',
            '<figure data-type="quote" data-label="fig-b" data-group="fig" data-number="2.1" id="label:fig-b"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 2.1. </span></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="3.0"></figure>',
            '<figure data-type="quote" data-label="fig-c" data-group="fig" data-number="3.1" id="label:fig-c"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 3.1. </span></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-type="quote" data-label="fig-d" data-group="fig" data-number="4.1" id="label:fig-d"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 4.1. </span></figcaption></figure>',
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 or 2 headings"></figure>',
            '<figure data-label="$-0.1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-label="$-0.4.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-label="$-0.1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<h2 id="index:0">0</h2>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="6.0"></figure>',
            '<figure data-type="quote" data-label="fig-e" data-group="fig" data-number="6.1" id="label:fig-e"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 6.1. </span></figcaption></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-5.0" data-group="$" hidden="" data-number="5.0"></figure>',
            '<figure data-type="quote" data-label="fig-f" data-group="fig" data-number="5.1" id="label:fig-f"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 5.1. </span></figcaption></figure>',
            '<figure data-label="$-0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Invalid base index"></figure>',
            '<figure data-type="quote" data-label="fig-g" data-group="fig" data-number="5.2" id="label:fig-g"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 5.2. </span></figcaption></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="$-0.0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-type="quote" data-label="fig-h" data-group="fig" data-number="5.3" id="label:fig-h"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 5.3. </span></figcaption></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-type="quote" data-label="fig-i" data-group="fig" data-number="5.4" id="label:fig-i"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 5.4. </span></figcaption></figure>',
            '<h1 id="index:0">0</h1>',
            '<figure data-type="quote" data-label="fig-j" data-group="fig" data-number="6.1" id="label:fig-j"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 6.1. </span></figcaption></figure>',
          ]);
      }
    });

    it('concat', () => {
      const target = parse([
        '$-0.0',
        '## 0',
        '$-0.0',
        '$fig-a\n> ',
        '$-0.0',
        '## 0',
        '$fig-b\n> ',
        '$-0.0',
        '### 0',
        '$fig-c\n> ',
        '$-1.0',
        '## 0',
        '$-0.0',
        '$fig-d\n> ',
        '### 0',
        '$-0.0',
        '## 0',
        '$-9.0',
        '$fig-e\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => normalize(el.outerHTML)),
          [
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 or 2 headings"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="0.0"></figure>',
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="0.1" id="label:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 0.1. </span></figcaption></figure>',
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 or 2 headings"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-type="quote" data-label="fig-b" data-group="fig" data-number="1.1" id="label:fig-b"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1.1. </span></figcaption></figure>',
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 or 2 headings"></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-type="quote" data-label="fig-c" data-group="fig" data-number="1.2" id="label:fig-c"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1.2. </span></figcaption></figure>',
            '<figure data-label="$-1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 or 2 headings"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="2.0"></figure>',
            '<figure data-type="quote" data-label="fig-d" data-group="fig" data-number="2.1" id="label:fig-d"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 2.1. </span></figcaption></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="2.0"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-9.0" data-group="$" hidden="" data-number="9.0"></figure>',
            '<figure data-type="quote" data-label="fig-e" data-group="fig" data-number="9.1" id="label:fig-e"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 9.1. </span></figcaption></figure>',
          ]);
      }
    });

    it('verbose', () => {
      const target = parse([
        '~~~figure [$fig-a]\n> \n\n~~~',
        '[$fig-a]',
        '[$fig-a]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1" id="label:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<p><a class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
            '<p><a class="label" data-label="fig-a" href="#label:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

    it('id', () => {
      const target = parse([
        '$fig-a\n> ',
        '$fig-a',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target, undefined, { id: '0' })];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="fig-a" data-group="fig" data-number="1" id="label:0:fig-a"><div><blockquote></blockquote></div><figcaption><span class="figindex">Fig. 1. </span></figcaption></figure>',
            '<p><a class="label" data-label="fig-a" href="#label:0:fig-a">Fig. 1</a></p>',
          ]);
      }
    });

  });

});
