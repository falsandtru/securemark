import { parse } from './parse';

describe('Unit: parser/api/parse', () => {
  describe('parse', () => {
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
        []);
    });

    it('linebreak', () => {
      assert('a\n\nb'.match(/^\s*$/m));
      assert(!parse('*a\n*\nb').textContent?.match(/^\s*$/m));
    });

    it('separation', () => {
      assert.deepStrictEqual(
        [...parse('\\ ').children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        [...parse('\\\n').children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        [...parse('a\\ \nb').children].map(el => el.outerHTML),
        ['<p>a <br>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\\\nb').children].map(el => el.outerHTML),
        ['<p>a<span class="linebreak"> </span>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\ \nb').children].map(el => el.outerHTML),
        ['<p>a<br>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\\nb').children].map(el => el.outerHTML),
        ['<p>a<br>b</p>']);
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
          '{^/a/..}',
          '{^/a/../}',
          '{^/a?/../}',
          '{^/a#/../}',
          '{./a}',
          '{../a}',
          '{../../a}',
          '{//domain/a}',
          '!{a}',
          '!{^/a}',
          '!{../../a}',
        ].join('\n\n'), { host: new URL(`${location.origin}/z`) }).children].map(el => el.outerHTML),
        [
          '<details class="header"><summary>Header</summary>URL: https://source/x/y</details>',
          '<p><a class="account" href="https://source/@a" rel="noopener" target="_blank">@a</a></p>',
          '<p><a class="account" href="https://domain/@a" rel="noopener" target="_blank">@domain/a</a></p>',
          '<p><a class="channel" href="https://source/@a?ch=b" rel="noopener" target="_blank">@a#b</a></p>',
          '<p><a class="channel" href="https://domain/@a?ch=b" rel="noopener" target="_blank">@domain/a#b</a></p>',
          '<p><a class="hashtag" href="https://source/hashtags/a" rel="noopener" target="_blank">#a</a></p>',
          '<p><a class="hashtag" href="https://domain/hashtags/a" rel="noopener" target="_blank">#domain/a</a></p>',
          '<p><a class="index" href="#index:a">a</a></p>',
          '<figure data-label="$-a" data-group="$" data-number="1" id="label:$-a"><div class="figcontent"><div class="math notranslate">$$\n$$</div></div><span class="figindex">(1)</span><figcaption></figcaption></figure>',
          '<p><a class="label" data-label="$-a" href="#label:$-a">(1)</a></p>',
          '<p><sup class="annotation" id="annotation:ref:1" title="a"><a href="#annotation:def:1" rel="noopener">*1</a></sup></p>',
          '<p><a href="https://source/x/a" rel="noopener" target="_blank">a</a></p>',
          '<p><a href="https://source/a" rel="noopener" target="_blank">/a</a></p>',
          '<p><a href="/z/a" rel="noopener">^/a</a></p>',
          '<p><a href="/z/a/.." rel="noopener">^/a/..</a></p>',
          '<p><a href="/z/a/../" rel="noopener">^/a/../</a></p>',
          '<p><a href="/z/a?/../" rel="noopener">^/a?/../</a></p>',
          '<p><a href="/z/a#/../" rel="noopener">^/a#/../</a></p>',
          '<p><a href="https://source/x/a" rel="noopener" target="_blank">./a</a></p>',
          '<p><a href="https://source/a" rel="noopener" target="_blank">../a</a></p>',
          '<p><a href="https://source/a" rel="noopener" target="_blank">../../a</a></p>',
          '<p><a href="//domain/a" rel="noopener" target="_blank">//domain/a</a></p>',
          '<p><a href="https://source/x/a" rel="noopener" target="_blank"><img class="media" data-src="https://source/x/a" alt=""></a></p>',
          '<p><a href="/z/a" rel="noopener" target="_blank"><img class="media" data-src="/z/a" alt=""></a></p>',
          '<p><a href="https://source/a" rel="noopener" target="_blank"><img class="media" data-src="https://source/a" alt=""></a></p>',
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
          '<details class="header"><summary>Header</summary>URL: https://source/x/y</details>',
          '<p><a href="/a" rel="noopener">^/a</a></p>',
          '<p><a href="https://source/x/a" rel="noopener" target="_blank">./a</a></p>',
        ]);
    });

    it('normalize', () => {
      assert.deepStrictEqual(
        [...parse('\0a\\\r\nb').children].map(el => el.outerHTML),
        ['<p>a<span class="linebreak"> </span>b</p>']);
    });

    it('error', () => {
      const a = parse(`${'a'.repeat(1000)}\n\n`.repeat(1000));
      assert(a.firstElementChild?.matches('h1.error[id^="error:"]'));
      const b = parse(`${'a'.repeat(10 * 1000 + 1)}`);
      assert(b.firstElementChild?.matches('h1.error[id^="error:"]'));
    });

/*
    it('stress bracket', function () {
      assert.deepStrictEqual(
        [...parse(`${'('.repeat(500)}`).children].map(el => el.innerHTML[0]),
        ['(']);
    });

    it('stress link', function () {
      assert.deepStrictEqual(
        [...parse(`${'['.repeat(500)}](`).children].map(el => el.innerHTML[0]),
        ['[']);
    });

    it('stress media', function () {
      assert.deepStrictEqual(
        [...parse(`${'!['.repeat(500)}](`).children].map(el => el.innerHTML[0]),
        ['!']);
    });

    it('stress ruby', function () {
      assert.deepStrictEqual(
        [...parse(`${'[a](b\n'.repeat(50)}`).children].map(el => el.innerHTML[0]),
        ['[']);
    });

    it('stress math', function () {
      assert.deepStrictEqual(
        [...parse(`${'${'.repeat(500)}a`).children].map(el => el.innerHTML[0]),
        ['$']);
    });

    it('stress comment', function () {
      assert.deepStrictEqual(
        [...parse(`${'<# '.repeat(500)}`).children].map(el => el.innerHTML[0]),
        ['<']);
    });

    it('stress parser', function () {
      assert.deepStrictEqual(
        [...parse(`!${'!{a}'.repeat(2000)}}`).children].map(el => el.innerHTML[0]),
        ['!']);
    });

    it('recursion', function () {
      assert.deepStrictEqual(
        [...parse(`${'('.repeat(9000)}${'{a}'})\n\na`).children].map(el => el.textContent!.includes('Error:')),
        [true, false]);
    });
*/

  });

});
