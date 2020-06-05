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

    it('normalize', () => {
      assert.deepStrictEqual(
        [...parse('a\\\r\nb').children].map(el => el.outerHTML),
        ['<p>a<span class="linebreak"> </span>b</p>']);
    });

    it('origin', () => {
      assert.deepStrictEqual(
        [...parse('@a', { origin: 'https://localhost' }).children].map(el => el.outerHTML),
        ['<p><a class="account" href="https://localhost/@a" rel="noopener">@a</a></p>']);
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
