import { figure } from './figure';
import { parse as parse_ } from '../../parser';
import { html } from 'typed-dom/dom';
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
        '$test-a\n> ',
        '$test-a',
        '$test-b',
        '$test-a',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<p><a class="label" data-label="test-a" href="#label:test-a">Test 1</a></p>',
            '<p><a class="label invalid" data-label="test-b" data-invalid-syntax="label" data-invalid-type="reference" data-invalid-message="Missing the target figure">$test-b</a></p>',
            '<p><a class="label" data-label="test-a" href="#label:test-a">Test 1</a></p>',
          ]);
      }
    });

    it('some', () => {
      const target = parse([
        '$test-a\n> ',
        '## 0',
        '$test-b\n> ',
        '$quote-a\n> ',
        '$test-b\n> ',
        '$test-c\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-type="quote" data-label="test-b" data-group="test" data-number="2" id="label:test-b"><figcaption><span class="figindex">Test 2. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-type="quote" data-label="quote-a" data-group="quote" data-number="1" id="label:quote-a"><figcaption><span class="figindex">Quote 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-type="quote" data-label="test-b" data-group="test" data-number="3" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Duplicate label"><figcaption><span class="figindex">Test 3. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-type="quote" data-label="test-c" data-group="test" data-number="4" id="label:test-c"><figcaption><span class="figindex">Test 4. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
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
            '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><figcaption><span class="figindex">(1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
            '<p><a class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          ]);
      }
    });

    it('fixed', () => {
      const target = parse([
        '$test-2\n> ',
        '$test-3.1\n> ',
        '$-4.1.1\n$$\n$$',
        '$-a\n$$\n$$',
        '$test-a\n> ',
        '$test-2',
        '$-4.1.1',
        '$test-1',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="test-2" data-group="test" data-number="2" id="label:test-2"><figcaption><span class="figindex">Test 2. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-type="quote" data-label="test-3.1" data-group="test" data-number="3.1" id="label:test-3.1"><figcaption><span class="figindex">Test 3.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-type="math" data-label="$-4.1.1" data-group="$" data-number="4.1.1" id="label:$-4.1.1"><figcaption><span class="figindex">(4.1.1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
            '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><figcaption><span class="figindex">(1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<p><a class="label" data-label="test-2" href="#label:test-2">Test 2</a></p>',
            '<p><a class="label" data-label="$-4.1.1" href="#label:$-4.1.1">(4.1.1)</a></p>',
            '<p><a class="label invalid" data-label="test-1" data-invalid-syntax="label" data-invalid-type="reference" data-invalid-message="Missing the target figure">$test-1</a></p>',
          ]);
      }
    });

    it('separation', () => {
      const target = html('blockquote', parse([
        '!>> ~~~figure $test-a\n>> > \n>>\n~~~\n> ~~~figure $test-a\n> > \n>\n~~~',
        '~~~~example/markdown\n~~~figure $test-a\n> \n\n~~~\n\n$test-a\n~~~~',
        '~~~figure $test-b\n> \n\n~~~',
        '~~~figure $test-a\n> \n\n~~~',
      ].join('\n\n')).children);
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<blockquote><blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><ol class="references"></ol></section></blockquote><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><ol class="references"></ol></section></blockquote>',
            '<aside class="example" data-type="markdown"><pre translate="no">~~~figure $test-a\n&gt; \n\n~~~\n\n$test-a</pre><hr><section><figure data-type="quote" data-label="test-a" data-group="test" data-number="1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure><p><a class="label disabled" data-label="test-a">Test 1</a></p><ol class="references"></ol></section></aside>',
            '<figure data-type="quote" data-label="test-b" data-group="test" data-number="1" id="label:test-b"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="2" id="label:test-a"><figcaption><span class="figindex">Test 2. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
          ]);
      }
    });

    it('base', () => {
      const target = parse([
        '# 0',
        '$-0.0',
        '## 0',
        '$test-1\n> ',
        '## 0',
        '!> ## 0',
        '$test-b\n> ',
        '## 0',
        '$-0.0.0',
        '### 0',
        '$-0.0',
        '$test-c\n> ',
        '## 0',
        '$-0.1.0',
        '$test-d\n> ',
        '$-0.0',
        '$-0.1.0',
        '$-0.4.0',
        '$-0.1.0',
        '## 0',
        '## 0',
        '$-0.0',
        '$test-e\n> ',
        '## 0',
        '$-5.0',
        '$test-f\n> ',
        '$-0',
        '$test-g\n> ',
        '### 0',
        '$-0.0.0',
        '$test-h\n> ',
        '### 0',
        '$test-i\n> ',
        '# 0',
        '$test-j\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => normalize(el.outerHTML)),
          [
            '<h1 id="index:0">0</h1>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="0.0"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-type="quote" data-label="test-1" data-group="test" data-number="1" id="label:test-1"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h2 id="index:0">0</h2>',
            '<blockquote><section><h2>0</h2><ol class="references"></ol></section></blockquote>',
            '<figure data-type="quote" data-label="test-b" data-group="test" data-number="2.1" id="label:test-b"><figcaption><span class="figindex">Test 2.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="3.0"></figure>',
            '<figure data-type="quote" data-label="test-c" data-group="test" data-number="3.1" id="label:test-c"><figcaption><span class="figindex">Test 3.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-type="quote" data-label="test-d" data-group="test" data-number="4.1" id="label:test-d"><figcaption><span class="figindex">Test 4.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 to 6 headings"></figure>',
            '<figure data-label="$-0.1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-label="$-0.4.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-label="$-0.1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<h2 id="index:0">0</h2>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="6.0"></figure>',
            '<figure data-type="quote" data-label="test-e" data-group="test" data-number="6.1" id="label:test-e"><figcaption><span class="figindex">Test 6.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-5.0" data-group="$" hidden="" data-number="5.0"></figure>',
            '<figure data-type="quote" data-label="test-f" data-group="test" data-number="5.1" id="label:test-f"><figcaption><span class="figindex">Test 5.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-label="$-0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Invalid base index"></figure>',
            '<figure data-type="quote" data-label="test-g" data-group="test" data-number="5.2" id="label:test-g"><figcaption><span class="figindex">Test 5.2. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="$-0.0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="argument" data-invalid-message="Base index must be $-x.0 format"></figure>',
            '<figure data-type="quote" data-label="test-h" data-group="test" data-number="5.3" id="label:test-h"><figcaption><span class="figindex">Test 5.3. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-type="quote" data-label="test-i" data-group="test" data-number="5.4" id="label:test-i"><figcaption><span class="figindex">Test 5.4. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h1 id="index:0">0</h1>',
            '<figure data-type="quote" data-label="test-j" data-group="test" data-number="6.1" id="label:test-j"><figcaption><span class="figindex">Test 6.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
          ]);
      }
    });

    it('concat', () => {
      const target = parse([
        '$-0.0',
        '## 0',
        '$-0.0',
        '$test-a\n> ',
        '$-0.0',
        '## 0',
        '$test-b\n> ',
        '$-0.0',
        '### 0',
        '$test-c\n> ',
        '$-1.0',
        '## 0',
        '$-0.0',
        '$test-d\n> ',
        '### 0',
        '$-0.0',
        '## 0',
        '$-9.0',
        '$test-e\n> ',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => normalize(el.outerHTML)),
          [
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 to 6 headings"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="0.0"></figure>',
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="0.1" id="label:test-a"><figcaption><span class="figindex">Test 0.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 to 6 headings"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-type="quote" data-label="test-b" data-group="test" data-number="1.1" id="label:test-b"><figcaption><span class="figindex">Test 1.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-label="$-0.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 to 6 headings"></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-type="quote" data-label="test-c" data-group="test" data-number="1.2" id="label:test-c"><figcaption><span class="figindex">Test 1.2. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<figure data-label="$-1.0" data-group="$" class="invalid" data-invalid-syntax="figure" data-invalid-type="position" data-invalid-message="Base index declarations must be after level 1 to 6 headings"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="2.0"></figure>',
            '<figure data-type="quote" data-label="test-d" data-group="test" data-number="2.1" id="label:test-d"><figcaption><span class="figindex">Test 2.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<h3 id="index:0">0</h3>',
            '<figure data-label="$-0.0" data-group="$" hidden="" data-number="2.0"></figure>',
            '<h2 id="index:0">0</h2>',
            '<figure data-label="$-9.0" data-group="$" hidden="" data-number="9.0"></figure>',
            '<figure data-type="quote" data-label="test-e" data-group="test" data-number="9.1" id="label:test-e"><figcaption><span class="figindex">Test 9.1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
          ]);
      }
    });

    it('verbose', () => {
      const target = parse([
        '~~~figure [$test-a]\n> \n\n~~~',
        '[$test-a]',
        '[$test-a]',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target)];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<p><a class="label" data-label="test-a" href="#label:test-a">Test 1</a></p>',
            '<p><a class="label" data-label="test-a" href="#label:test-a">Test 1</a></p>',
          ]);
      }
    });

    it('id', () => {
      const target = parse([
        '$test-a\n> ',
        '$test-a',
      ].join('\n\n'));
      for (let i = 0; i < 3; ++i) {
        [...figure(target, undefined, { id: '0' })];
        assert.deepStrictEqual(
          [...target.children].map(el => el.outerHTML),
          [
            '<figure data-type="quote" data-label="test-a" data-group="test" data-number="1" id="label:0:test-a"><figcaption><span class="figindex">Test 1. </span><span class="figtext"></span></figcaption><div><blockquote></blockquote></div></figure>',
            '<p><a class="label" data-label="test-a" href="#label:0:test-a">Test 1</a></p>',
          ]);
      }
    });

  });

});
