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
      assert.deepStrictEqual(
        [...parse(' ').children].map(el => el.outerHTML),
        []);
      assert.deepStrictEqual(
        [...parse('\n').children].map(el => el.outerHTML),
        []);
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
        ['<p>a</p>', '<p>b</p>']);
      assert.deepStrictEqual(
        [...parse('a\n\\\nb').children].map(el => el.outerHTML),
        ['<p>a</p>', '<p>b</p>']);
      assert.deepStrictEqual(
        [...parse('~~~a\ninvalid\n~~~').children].map(el => el.outerHTML),
        ['<p class="invalid" data-invalid-syntax="extension" data-invalid-type="syntax">Invalid syntax: Extension: Invalid extension name, attribute, or content.</p>']);
      assert.deepStrictEqual(
        [...parse('~~~a\ninvalid\n\ncaption\n~~~').children].map(el => el.outerHTML),
        ['<p class="invalid" data-invalid-syntax="extension" data-invalid-type="syntax">Invalid syntax: Extension: Invalid extension name, attribute, or content.</p>']);
    });

    it('normalize', () => {
      assert.deepStrictEqual(
        [...parse('a\\\r\nb').children].map(el => el.outerHTML),
        ['<p>a<span class="linebreak"> </span>b</p>']);
    });

  });

});
