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
            'URL: https://host/x/y',
            '---',
          ].join('\n'),
          '@a',
          '@domain/a',
          '@a#b',
          '@domain/a#b',
          '#a',
          '{a}',
          '{/a}',
          '{./a}',
          '{../a}',
          '{../../a}',
          '{//domain/a}',
          '!{a}',
          '!{../../a}',
        ].join('\n\n')).children].map(el => el.outerHTML),
        [
          '<div class="header">URL: https://host/x/y</div>',
          '<p><a class="account" href="https://host/@a" rel="noopener" target="_blank">@a</a></p>',
          '<p><a class="account" href="https://domain/@a" rel="noopener" target="_blank">@domain/a</a></p>',
          '<p><a class="channel" href="https://host/@a?ch=b" rel="noopener" target="_blank">@a#b</a></p>',
          '<p><a class="channel" href="https://domain/@a?ch=b" rel="noopener" target="_blank">@domain/a#b</a></p>',
          '<p><a class="hashtag" href="https://host/hashtags/a" rel="noopener" target="_blank">#a</a></p>',
          '<p><a href="https://host/x/a" rel="noopener" target="_blank">a</a></p>',
          '<p><a href="https://host/a" rel="noopener" target="_blank">/a</a></p>',
          '<p><a href="https://host/x/a" rel="noopener" target="_blank">./a</a></p>',
          '<p><a href="https://host/a" rel="noopener" target="_blank">../a</a></p>',
          '<p><a href="https://host/a" rel="noopener" target="_blank">../../a</a></p>',
          '<p><a href="//domain/a" rel="noopener" target="_blank">//domain/a</a></p>',
          '<p><a href="https://host/x/a" rel="noopener" target="_blank"><img class="media" data-src="https://host/x/a" alt=""></a></p>',
          '<p><a href="https://host/a" rel="noopener" target="_blank"><img class="media" data-src="https://host/a" alt=""></a></p>',
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
