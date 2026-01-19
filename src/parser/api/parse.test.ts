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
        ['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span></p>']);
      assert.deepStrictEqual(
        [...parse('[%\n<wbr>\n%]\na').children].map(el => el.outerHTML),
        ['<p><span class="remark"><input type="checkbox"><span>[%<br>&lt;wbr&gt;<br>%]</span></span><br>a</p>']);
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
          '<p><a class="index" href="#index::a">a</a></p>',
          '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><figcaption><span class="figindex">(1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
          '<p><a class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          '<p><sup class="annotation" id="annotation::ref:a:1" title="a"><span></span><a href="#annotation::def:a:1">*1</a></sup></p>',
          '<p><a class="url" href="https://source/x/a" target="_blank">a</a></p>',
          '<p><a class="url" href="https://source/a" target="_blank">/a</a></p>',
          '<p><a class="url" href="/z/a">^/a</a></p>',
          '<p><a class="url" href="https://source/x/a" target="_blank">./a</a></p>',
          '<p><a class="url" href="https://source/a" target="_blank">../a</a></p>',
          '<p><a class="url" href="https://source/a" target="_blank">../../a</a></p>',
          '<p><a class="url" href="//domain/a" target="_blank">//domain/a</a></p>',
          '<div><a href="https://source/x/a" target="_blank"><img class="media" data-src="https://source/x/a" alt=""></a></div>',
          '<div><a href="/z/a" target="_blank"><img class="media" data-src="/z/a" alt=""></a></div>',
          '<div><a href="https://source/a" target="_blank"><img class="media" data-src="https://source/a" alt=""></a></div>',
          '<ol class="annotations"><li id="annotation::def:a:1" data-marker="*1"><span>a</span><sup><a href="#annotation::ref:a:1">^1</a></sup></li></ol>',
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

    it('note', () => {
      const notes = { references: html('ol') };
      assert.deepStrictEqual(
        [...parse('$-a\n$$\n$$\n\n(($-a[[^B]]))[[^B|$-a]]', { notes }).children].map(el => el.outerHTML),
        [
          '<figure data-type="math" data-label="$-a" data-group="$" data-number="1" id="label:$-a"><figcaption><span class="figindex">(1)</span><span class="figtext"></span></figcaption><div><div class="math" translate="no">$$\n$$</div></div></figure>',
          '<p><sup class="annotation" id="annotation::ref:[$-a]:1" title="(1)"><span></span><a href="#annotation::def:[$-a]:1">*1</a></sup><sup class="reference" data-abbr="B" id="reference::ref:B:1" title="(1)"><span></span><a href="#reference::def:B">[B]</a></sup></p>',
          '<ol class="annotations"><li id="annotation::def:[$-a]:1" data-marker="*1"><span><a class="label" data-label="$-a" href="#label:$-a">(1)</a><sup class="reference" data-abbr="B" id="reference::ref:B:2" title="(1)"><span></span><a href="#reference::def:B">[B]</a></sup></span><sup><a href="#annotation::ref:[$-a]:1">^1</a></sup></li></ol>',
        ]);
      assert.deepStrictEqual(
        notes.references.outerHTML,
        '<ol><li id="reference::def:B"><span><a class="label" data-label="$-a" href="#label:$-a">(1)</a></span><sup><a href="#reference::ref:B:1" title="(1)">^1</a><a href="#reference::ref:B:2">^2</a></sup></li></ol>');
      assert.deepStrictEqual(
        [...parse([
          '[[^A 1|b]]',
          '[[^A 1,|b]]',
          '[[^A 1, |b]]',
          '[[^Xyz 2020|b]]',
          '[[^Xyz 2020, 1|b]]',
          '[[^Xyz 2020, 1, 2|b]]',
          '[[^Xyz 2020, 1, fig. 1.1|b]]',
          '[[^Xyz 2020, 1, fig. 1.1-2.1b|b]]',
          '[[^Xyz 2020, 1, fig. 1.1a-b|b]]',
          '[[^Xyz 2020, 1-2|b]]',
          '[[^Xyz 2020, 1:1-2|b]]',
          '[[^Xyz 2020, 1n|b]]',
          '[[^Xyz 2020, 1n1|b]]',
          '[[^Xyz 2020, 1nn1-2|b]]',
          '[[^Xyz 2020, i|b]]',
          '[[^Xyz 2020, capter 1|b]]',
          '[[^Xyz 2020, cap. 1|b]]',
          '[[^Xyz 2020a|b]]',
          '[[^Xyz 2020a, 1|b]]',
          '[[^Xyz 2020-2021a|b]]',
          '[[^Xyz 2020-2021a, 1|b]]',
          '[[^Xyz, April 1, 2020|b]]',
          '[[^Xyz, April 1, 2020, 1|b]]',
          '[[^Xyz n.d.|b]]',
          '[[^Xyz n.d., 1|b]]',
          '[[^X. Y., and Z et al. 2020, 1-2|b]]',
          '[[^A title 2020|b]]',
          '[[^A title 2020, 1|b]]',
          '[[^Constitution, art. 2|b]]',
          '[[^Constitution, art. 2, sec. 1|b]]',
        ].join('\n\n'), { notes }).children].map(el => el.outerHTML),
        [
          '<p><sup class="reference" data-abbr="A 1" id="reference::ref:A_1:1" title="b"><span></span><a href="#reference::def:A_1">[A 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="A 1," id="reference::ref:A_1:2" title="b"><span></span><a href="#reference::def:A_1">[A 1,]</a></sup></p>',
          '<p><sup class="reference" data-abbr="A 1," id="reference::ref:A_1:3" title="b"><span></span><a href="#reference::def:A_1">[A 1,]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020" id="reference::ref:Xyz_2020:1" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1" id="reference::ref:Xyz_2020:2" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1, 2" id="reference::ref:Xyz_2020:3" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1, 2]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1" id="reference::ref:Xyz_2020:4" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1, fig. 1.1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1-2.1b" id="reference::ref:Xyz_2020:5" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1, fig. 1.1-2.1b]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1, fig. 1.1a-b" id="reference::ref:Xyz_2020:6" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1, fig. 1.1a-b]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1-2" id="reference::ref:Xyz_2020:7" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1-2]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1:1-2" id="reference::ref:Xyz_2020:8" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1:1-2]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1n" id="reference::ref:Xyz_2020:9" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1n]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1n1" id="reference::ref:Xyz_2020:10" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1n1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, 1nn1-2" id="reference::ref:Xyz_2020:11" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, 1nn1-2]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, i" id="reference::ref:Xyz_2020:12" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, i]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, capter 1" id="reference::ref:Xyz_2020:13" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, capter 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020, cap. 1" id="reference::ref:Xyz_2020:14" title="b"><span></span><a href="#reference::def:Xyz_2020">[Xyz 2020, cap. 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020a" id="reference::ref:Xyz_2020a:1" title="b"><span></span><a href="#reference::def:Xyz_2020a">[Xyz 2020a]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020a, 1" id="reference::ref:Xyz_2020a:2" title="b"><span></span><a href="#reference::def:Xyz_2020a">[Xyz 2020a, 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020-2021a" id="reference::ref:Xyz_2020-2021a:1" title="b"><span></span><a href="#reference::def:Xyz_2020-2021a">[Xyz 2020-2021a]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz 2020-2021a, 1" id="reference::ref:Xyz_2020-2021a:2" title="b"><span></span><a href="#reference::def:Xyz_2020-2021a">[Xyz 2020-2021a, 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz, April 1, 2020" id="reference::ref:Xyz,_April_1,_2020:1" title="b"><span></span><a href="#reference::def:Xyz,_April_1,_2020">[Xyz, April 1, 2020]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz, April 1, 2020, 1" id="reference::ref:Xyz,_April_1,_2020:2" title="b"><span></span><a href="#reference::def:Xyz,_April_1,_2020">[Xyz, April 1, 2020, 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz n.d." id="reference::ref:Xyz_n.d.:1" title="b"><span></span><a href="#reference::def:Xyz_n.d.">[Xyz n.d.]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Xyz n.d., 1" id="reference::ref:Xyz_n.d.:2" title="b"><span></span><a href="#reference::def:Xyz_n.d.">[Xyz n.d., 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="X. Y., and Z et al. 2020, 1-2" id="reference::ref:X._Y.,_and_Z_et_al._2020:1" title="b"><span></span><a href="#reference::def:X._Y.,_and_Z_et_al._2020">[X. Y., and Z et al. 2020, 1-2]</a></sup></p>',
          '<p><sup class="reference" data-abbr="A title 2020" id="reference::ref:A_title_2020:1" title="b"><span></span><a href="#reference::def:A_title_2020">[A title 2020]</a></sup></p>',
          '<p><sup class="reference" data-abbr="A title 2020, 1" id="reference::ref:A_title_2020:2" title="b"><span></span><a href="#reference::def:A_title_2020">[A title 2020, 1]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Constitution, art. 2" id="reference::ref:Constitution:1" title="b"><span></span><a href="#reference::def:Constitution">[Constitution, art. 2]</a></sup></p>',
          '<p><sup class="reference" data-abbr="Constitution, art. 2, sec. 1" id="reference::ref:Constitution:2" title="b"><span></span><a href="#reference::def:Constitution">[Constitution, art. 2, sec. 1]</a></sup></p>',
        ]);
    });

    it('normalize', () => {
      assert.deepStrictEqual(
        [...parse('a\\\r\nb').children].map(el => el.outerHTML),
        ['<p>a<br>b</p>']);
    });

    it('recursion', () => {
      assert.deepStrictEqual(
        [...parse(`${'{'.repeat(20)}a`).children].map(el => el.outerHTML),
        [`<p>${'{'.repeat(20)}a</p>`]);
      assert.deepStrictEqual(
        [...parse(`${'{'.repeat(21)}a`).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'{'.repeat(21)}a</pre>`,
        ]);
      assert.deepStrictEqual(
        [...parse(`${'('.repeat(20)}a`).children].map(el => el.outerHTML),
        [`<p>${'('.repeat(20)}a</p>`]);
      assert.deepStrictEqual(
        [...parse(`${'('.repeat(21)}a`).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'('.repeat(21)}a</pre>`,
        ]);
      assert.deepStrictEqual(
        [...parse(`${'['.repeat(20)}a`).children].map(el => el.outerHTML),
        [`<p>${'['.repeat(20)}a</p>`]);
      assert.deepStrictEqual(
        [...parse(`${'['.repeat(21)}a`).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too much recursion</h1>',
          `<pre class="error" translate="no">${'['.repeat(21)}a</pre>`,
        ]);
      assert.deepStrictEqual(
        [...parse(`${'['.repeat(20)}\na`).children].map(el => el.outerHTML),
        [`<p>${'['.repeat(20)}<br>a</p>`]);
    });

    it('recovery', () => {
      assert.deepStrictEqual(
        [...parse(`${'{'.repeat(21)}\n\na`).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          `<h1 id="error:rnd" class="error">Error: Too much recursion</h1>`,
          `<pre class="error" translate="no">${'{'.repeat(21)}\n</pre>`,
          '<p>a</p>',
        ]);
    });

    if (!navigator.userAgent.includes('Chrome')) return;

    it('creation', function () {
      this.timeout(10000);
      assert.deepStrictEqual(
        [...parse('.'.repeat(100000)).children].map(el => el.outerHTML),
        [`<p>${'.'.repeat(100000)}</p>`]);
    });

    it.skip('creation error', function () {
      this.timeout(10000);
      assert.deepStrictEqual(
        [...parse('.'.repeat(100001)).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too many creations</h1>',
          `<pre class="error" translate="no">${'.'.repeat(1000 - 3)}...</pre>`,
        ]);
    });

    it('backtrack', function () {
      this.timeout(5000);
      const str = `${'.'.repeat(10)}((${'['.repeat(13)}{{http://[[[${'.'.repeat(7134)}`;
      assert.deepStrictEqual(
        [...parse(str).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [`<p>${str}</p>`]);
    });

    it('backtrack error', function () {
      this.timeout(5000);
      const str = `${'.'.repeat(10)}((${'['.repeat(13)}{{http://[[[${'.'.repeat(7134 + 1)}`;
      assert.deepStrictEqual(
        [...parse(str).children].map(el => el.outerHTML.replace(/:\w+/, ':rnd')),
        [
          '<h1 id="error:rnd" class="error">Error: Too many creations</h1>',
          `<pre class="error" translate="no">${str.slice(0, 1000 - 3)}...</pre>`,
        ]);
    });

  });

});
