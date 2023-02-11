import { parse } from './parse';
import { html } from 'typed-dom/dom';

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
        [...parse('[%\n<wbr>\n%]').children].map(el => el.outerHTML),
        ['<p><span class="comment"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span></p>']);
      assert.deepStrictEqual(
        [...parse('[%\n<wbr>\n%]\na').children].map(el => el.outerHTML),
        ['<p><span class="comment"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span><br>a</p>']);
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
        ['<p>a<br>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\ \nb').children].map(el => el.outerHTML),
        ['<p>a<br>\\<br>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\\nb').children].map(el => el.outerHTML),
        ['<p>a<br>\\<br>b</p>']);
    });

    it('indent', () => {
      assert.deepStrictEqual(
        [...parse('\ta').children].map(el => el.outerHTML),
        ['<p>\ta</p>']);
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
          '<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="url" data-value="https://source/x/y"><span class="field-name">URL</span>: <span class="field-value">https://source/x/y</span>\n</span></details></aside>',
          '<p><a class="account" href="https://source/@a" target="_blank">@a</a></p>',
          '<p><a class="account" href="https://domain/@a" target="_blank">@domain/a</a></p>',
          '<p><a class="channel" href="https://source/@a?ch=b" target="_blank">@a#b</a></p>',
          '<p><a class="channel" href="https://domain/@a?ch=b" target="_blank">@domain/a#b</a></p>',
          '<p><a class="hashtag" href="https://source/hashtags/a" target="_blank">#a</a></p>',
          '<p><a class="hashtag" href="https://domain/hashtags/a" target="_blank">#domain/a</a></p>',
          '<p><a class="index" href="#index:a">a</a></p>',
          '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><figcaption><span class="figindex">(1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
          '<p><a class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          '<p><sup class="annotation" id="annotation::ref:1" title="a"><span hidden="">a</span><a href="#annotation::def:1">*1</a></sup></p>',
          '<p><a class="url" href="https://source/x/a" target="_blank">a</a></p>',
          '<p><a class="url" href="https://source/a" target="_blank">/a</a></p>',
          '<p><a class="url" href="/z/a">^/a</a></p>',
          '<p><a class="url" href="https://source/x/a" target="_blank">./a</a></p>',
          '<p><a class="url" href="https://source/a" target="_blank">../a</a></p>',
          '<p><a class="url" href="https://source/a" target="_blank">../../a</a></p>',
          '<p><a class="url" href="//domain/a" target="_blank">//domain/a</a></p>',
          '<p><a href="https://source/x/a" target="_blank"><img class="media" data-src="https://source/x/a" alt=""></a></p>',
          '<p><a href="/z/a" target="_blank"><img class="media" data-src="/z/a" alt=""></a></p>',
          '<p><a href="https://source/a" target="_blank"><img class="media" data-src="https://source/a" alt=""></a></p>',
          '<ol class="annotations"><li id="annotation::def:1" data-marker="*1">a<sup><a href="#annotation::ref:1">^1</a></sup></li></ol>',
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
          '<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="url" data-value="https://source/x/y"><span class="field-name">URL</span>: <span class="field-value">https://source/x/y</span>\n</span></details></aside>',
          '<p><a class="url" href="/a">^/a</a></p>',
          '<p><a class="url" href="https://source/x/a" target="_blank">./a</a></p>',
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
          `<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="url" data-value="${location.origin}/x/y"><span class="field-name">URL</span>: <span class="field-value">${location.origin}/x/y</span>\n</span></details></aside>`,
          '<p><a class="url" href="/z/a">^/a</a></p>',
          '<p><a class="url" href="/x/a">./a</a></p>',
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
          `<aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="url" data-value="https://example/x"><span class="field-name">URL</span>: <span class="field-value">https://example/x</span>\n</span></details></aside>`,
          '<pre class="invalid" translate="no" data-invalid-syntax="header" data-invalid-type="syntax" data-invalid-message="Invalid syntax">---\nURL: https://example/y\n---\n</pre>',
          '<aside class="example" data-type="markdown"><pre translate="no">---\nURL: https://example/y\n---\n\n{#}</pre><hr><section><aside class="header"><details open=""><summary>Header</summary><span class="field" data-name="url" data-value="https://example/y"><span class="field-name">URL</span>: <span class="field-value">https://example/y</span>\n</span></details></aside><p><a class="url" href="https://example/y#" target="_blank">#</a></p><h2>References</h2><ol class="references"></ol></section></aside>',
          '<p><a class="url" href="https://example/x#" target="_blank">#</a></p>',
        ]);
    });

    it('footnote', () => {
      const footnotes = { references: html('ol') };
      assert.deepStrictEqual(
        [...parse('$-a\n$$\n$$\n\n(($-a[[b]][[c_d_]]))', { footnotes }).children].map(el => el.outerHTML),
        [
          '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><figcaption><span class="figindex">(1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
          '<p><sup class="annotation" id="annotation::ref:1" title="(1)"><span hidden=""><a class="label" data-label="$-a" href="#label:$-a">(1)</a><sup class="reference" id="reference::ref:1" title="b"><span hidden="">b</span><a href="#reference::def:1">[1]</a></sup><sup class="reference" id="reference::ref:2" title="cd"><span hidden="">c<em>d</em></span><a href="#reference::def:2">[2]</a></sup></span><a href="#annotation::def:1">*1</a></sup></p>',
          '<ol class="annotations"><li id="annotation::def:1" data-marker="*1"><a class="label" data-label="$-a" href="#label:$-a">(1)</a><sup class="reference" id="reference::ref:1" title="b"><span hidden="">b</span><a href="#reference::def:1">[1]</a></sup><sup class="reference" id="reference::ref:2" title="cd"><span hidden="">c<em>d</em></span><a href="#reference::def:2">[2]</a></sup><sup><a href="#annotation::ref:1">^1</a></sup></li></ol>',
        ]);
      assert.deepStrictEqual(
        footnotes.references.outerHTML,
        '<ol><li id="reference::def:1">b<sup><a href="#reference::ref:1">^1</a></sup></li><li id="reference::def:2">c<em>d</em><sup><a href="#reference::ref:2">^2</a></sup></li></ol>');
    });

    it('normalize', () => {
      assert.deepStrictEqual(
        [...parse('a\\\r\nb').children].map(el => el.outerHTML),
        ['<p>a<br>b</p>']);
    });

    it('backtrack', () => {
      assert.deepStrictEqual(
        [...parse('"[% '.repeat(100) + '\n\na').children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'"[% '.repeat(100)}\n</pre>`,
          '<p>a</p>',
        ]);
    });

    it('recursion', () => {
      assert.deepStrictEqual(
        [...parse('{'.repeat(20)).children].map(el => el.outerHTML),
        [`<p>${'{'.repeat(20)}</p>`]);
      assert.deepStrictEqual(
        [...parse('{'.repeat(21)).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'{'.repeat(21)}</pre>`,
        ]);
      assert.deepStrictEqual(
        [...parse('('.repeat(20)).children].map(el => el.outerHTML),
        [`<p>${'('.repeat(20)}</p>`]);
      assert.deepStrictEqual(
        [...parse('('.repeat(22)).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'('.repeat(22)}</pre>`,
        ]);
      assert.deepStrictEqual(
        [...parse('['.repeat(20)).children].map(el => el.outerHTML),
        [`<p>${'['.repeat(20)}</p>`]);
      assert.deepStrictEqual(
        [...parse('['.repeat(22)).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'['.repeat(22)}</pre>`,
        ]);
      assert.deepStrictEqual(
        [...parse('['.repeat(17) + '\na').children].map(el => el.outerHTML),
        [`<p>${'['.repeat(17)}<br>a</p>`]);
    });

    if (!navigator.userAgent.includes('Chrome')) return;

    it('creation', function () {
      this.timeout(5000);
      // 実測500ms程度
      assert.deepStrictEqual(
        [...parse('.'.repeat(50000)).children].map(el => el.outerHTML),
        [`<p>${'.'.repeat(50000)}</p>`]);
    });

    it('creation error', function () {
      this.timeout(5000);
      // 実測500ms程度
      assert.deepStrictEqual(
        [...parse('.'.repeat(50001)).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too many creations</h1>',
          `<pre class="error" translate="no">${'.'.repeat(1000).slice(0, 997)}...</pre>`,
        ]);
    });

  });

});
