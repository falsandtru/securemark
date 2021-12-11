import { parse } from './parse';
import { html } from 'typed-dom';

describe('Unit: parser/api/parse', () => {
  describe('parse', () => {
    it('huge input', () => {
      assert.throws(() =>
        parse(`${'\n'.repeat(10 * 1000 ** 2)}`));
    });

    it('huge segment', () => {
      assert.throws(() =>
        parse(`${'\n'.repeat(100 * 1000 + 1)}`));
    });

    it('result', () => {
      assert(parse('') instanceof DocumentFragment);
    });

    it('empty', () => {
      assert.deepStrictEqual(
        [...parse('').children].map(el => el.outerHTML),
        []);
    });

    it('invisible', () => {
      assert.deepStrictEqual(
        [...parse(' ').children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        [...parse('\n').children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        [...parse('\n\n').children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        [...parse('\\').children].map(el => el.outerHTML),
        ['<p>\\</p>']);
      assert.deepStrictEqual(
        [...parse('\\\na').children].map(el => el.outerHTML),
        ['<p>\\<br>a</p>']);
      assert.deepStrictEqual(
        [...parse('&Tab;').children].map(el => el.outerHTML),
        ['<p>&amp;Tab;</p>']);
      assert.deepStrictEqual(
        [...parse('&Tab;\na').children].map(el => el.outerHTML),
        ['<p>&amp;Tab;<br>a</p>']);
      assert.deepStrictEqual(
        [...parse('<wbr>').children].map(el => el.outerHTML),
        ['<p>&lt;wbr&gt;</p>']);
      assert.deepStrictEqual(
        [...parse('<wbr>\na').children].map(el => el.outerHTML),
        ['<p>&lt;wbr&gt;<br>a</p>']);
      assert.deepStrictEqual(
        [...parse('[#\n<wbr>\n#]').children].map(el => el.outerHTML),
        ['<p>[#<br>&lt;wbr&gt;<br>#]</p>']);
      assert.deepStrictEqual(
        [...parse('[#\n<wbr>\n#]\na').children].map(el => el.outerHTML),
        ['<p>[#<br>&lt;wbr&gt;<br>#]<br>a</p>']);
    });

    it('linebreak', () => {
      assert.deepStrictEqual(
        [...parse('\\ ').children].map(el => el.outerHTML),
        ['<p>\\</p>']);
      assert.deepStrictEqual(
        [...parse('\\\n').children].map(el => el.outerHTML),
        ['<p>\\</p>']);
      assert.deepStrictEqual(
        [...parse('a\\ \nb').children].map(el => el.outerHTML),
        ['<p>a <br>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\\\nb').children].map(el => el.outerHTML),
        ['<p>a<span class="linebreak"> </span>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\ \nb').children].map(el => el.outerHTML),
        ['<p>a<br>\\<br>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\\nb').children].map(el => el.outerHTML),
        ['<p>a<br>\\<br>b</p>']);
    });

    it('url', () => {
      assert.deepStrictEqual(
        [...parse([
          [
            '---',
            'URL: https://source/x/y',
            '---',
          ].join('\n'),
          '@a',
          '@domain/a',
          '@a#b',
          '@domain/a#b',
          '#a',
          '#domain/a',
          '[#a]',
          '$-a\n$$\n$$',
          '$-a',
          '((a))',
          '{a}',
          '{/a}',
          '{^/a}',
          '{./a}',
          '{../a}',
          '{../../a}',
          '{//domain/a}',
          '!{a}',
          '!{^/a}',
          '!{../../a}',
        ].join('\n\n'), { host: new URL(`${location.origin}/z`) }).children].map(el => el.outerHTML),
        [
          '<details class="header" open=""><summary>Header</summary>URL: https://source/x/y</details>',
          '<p><a href="https://source/@a" target="_blank" class="account">@a</a></p>',
          '<p><a href="https://domain/@a" target="_blank" class="account">@domain/a</a></p>',
          '<p><a href="https://source/@a?ch=b" target="_blank" class="channel">@a#b</a></p>',
          '<p><a href="https://domain/@a?ch=b" target="_blank" class="channel">@domain/a#b</a></p>',
          '<p><a href="https://source/hashtags/a" target="_blank" class="hashtag">#a</a></p>',
          '<p><a href="https://domain/hashtags/a" target="_blank" class="hashtag">#domain/a</a></p>',
          '<p><a class="index" href="#index:a">a</a></p>',
          '<figure data-label="$-a" data-group="$" data-number="1" id="label:$-a"><div class="figcontent"><div class="math" translate="no">$$\n$$</div></div><span class="figindex">(1)</span><figcaption></figcaption></figure>',
          '<p><a class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          '<p><sup class="annotation" id="annotation:ref:1" title="a"><span hidden="">a</span><a href="#annotation:def:1">*1</a></sup></p>',
          '<p><a href="https://source/x/a" target="_blank">a</a></p>',
          '<p><a href="https://source/a" target="_blank">/a</a></p>',
          '<p><a href="/z/a">^/a</a></p>',
          '<p><a href="https://source/x/a" target="_blank">./a</a></p>',
          '<p><a href="https://source/a" target="_blank">../a</a></p>',
          '<p><a href="https://source/a" target="_blank">../../a</a></p>',
          '<p><a href="//domain/a" target="_blank">//domain/a</a></p>',
          '<p><a href="https://source/x/a" target="_blank"><img class="media" data-src="https://source/x/a" alt=""></a></p>',
          '<p><a href="/z/a" target="_blank"><img class="media" data-src="/z/a" alt=""></a></p>',
          '<p><a href="https://source/a" target="_blank"><img class="media" data-src="https://source/a" alt=""></a></p>',
        ]);
      assert.deepStrictEqual(
        [...parse([
          [
            '---',
            'URL: https://source/x/y',
            '---',
          ].join('\n'),
          '{^/a}',
          '{./a}',
        ].join('\n\n'), { host: new URL(`${location.origin}/index.md`) }).children].map(el => el.outerHTML),
        [
          '<details class="header" open=""><summary>Header</summary>URL: https://source/x/y</details>',
          '<p><a href="/a">^/a</a></p>',
          '<p><a href="https://source/x/a" target="_blank">./a</a></p>',
        ]);
      assert.deepStrictEqual(
        [...parse([
          [
            '---',
            `URL: ${location.origin}/x/y`,
            '---',
          ].join('\n'),
          '{^/a}',
          '{./a}',
        ].join('\n\n'), { host: new URL(`${location.origin}/z`) }).children].map(el => el.outerHTML),
        [
          `<details class="header" open=""><summary>Header</summary>URL: ${location.origin}/x/y</details>`,
          '<p><a href="/z/a">^/a</a></p>',
          '<p><a href="/x/a">./a</a></p>',
        ]);
    });

    it('separation', () => {
      assert.deepStrictEqual(
        [...parse([
          [
            '---',
            'URL: https://example/x',
            '---',
          ].join('\n'),
          [
            '---',
            'URL: https://example/y',
            '---',
          ].join('\n'),
          [
            '~~~example/markdown',
            '---',
            'URL: https://example/y',
            '---',
            '',
            '{#}',
            '~~~',
          ].join('\n'),
          '{#}',
        ].join('\n\n'), { host: new URL(`${location.origin}/z`) }).children].map(el => el.outerHTML),
        [
          `<details class="header" open=""><summary>Header</summary>URL: https://example/x</details>`,
          '<pre class="invalid" translate="no" data-invalid-syntax="header" data-invalid-type="syntax" data-invalid-description="Invalid syntax.">---\nURL: https://example/y\n---\n</pre>',
          '<aside class="example" data-type="markdown"><pre translate="no">---\nURL: https://example/y\n---\n\n{#}</pre><hr><section><details class="header" open=""><summary>Header</summary>URL: https://example/y</details><p><a href="https://example/y#" target="_blank">#</a></p><ol class="annotations"></ol><ol class="references"></ol></section></aside>',
          '<p><a href="https://example/x#" target="_blank">#</a></p>',
        ]);
    });

    it('footnote', () => {
      const footnotes = { annotations: html('ol'), references: html('ol') };
      assert.deepStrictEqual(
        [...parse('$-a\n$$\n$$\n\n(($-a[[b]][[c]]))', { footnotes }).children].map(el => el.outerHTML),
        [
          '<figure data-label="$-a" data-group="$" data-number="1" id="label:$-a"><div class="figcontent"><div class="math" translate="no">$$\n$$</div></div><span class="figindex">(1)</span><figcaption></figcaption></figure>',
          '<p><sup class="annotation" id="annotation:ref:1" title="(1)[1][2]"><span hidden=""><a class="label" data-label="$-a" href="#label:$-a">(1)</a><sup class="reference" id="reference:ref:1" title="b"><span hidden="">b</span><a href="#reference:def:1">[1]</a></sup><sup class="reference" id="reference:ref:2" title="c"><span hidden="">c</span><a href="#reference:def:2">[2]</a></sup></span><a href="#annotation:def:1">*1</a></sup></p>',
        ]);
      assert.deepStrictEqual(
        footnotes.annotations.outerHTML,
        '<ol><li id="annotation:def:1"><a class="label" data-label="$-a" href="#label:$-a">(1)</a><sup class="reference" id="reference:ref:1" title="b"><span hidden="">b</span><a href="#reference:def:1">[1]</a></sup><sup class="reference" id="reference:ref:2" title="c"><span hidden="">c</span><a href="#reference:def:2">[2]</a></sup><sup><a href="#annotation:ref:1">^1</a></sup></li></ol>');
      assert.deepStrictEqual(
        footnotes.references.outerHTML,
        '<ol><li id="reference:def:1">b<sup><a href="#reference:ref:1">^1</a></sup></li><li id="reference:def:2">c<sup><a href="#reference:ref:2">^2</a></sup></li></ol>');
    });

    it('normalize', () => {
      assert.deepStrictEqual(
        [...parse('a\\\r\nb').children].map(el => el.outerHTML),
        ['<p>a<span class="linebreak"> </span>b</p>']);
    });

    it('reset', () => {
      assert.deepStrictEqual(
        [...parse(`"${'('.repeat(10000)}\n\n"`).children].slice(2).map(el => el.outerHTML),
        ['<p>"</p>']);
    });

  });

});
