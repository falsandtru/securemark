﻿import { toc } from './toc';
import { parse } from '../parser';
import { html } from 'typed-dom';

describe('Unit: util/toc', () => {
  describe('toc', () => {
    it('empty', () => {
      assert.strictEqual(
        toc(html('section', [])).outerHTML,
        html('ul').outerHTML);
    });

    it('1', () => {
      assert.strictEqual(
        toc(parse('# 1')).outerHTML,
        html('ul', [
          html('li', [html('a', { href: '#index:1' }, '1')]),
        ]).outerHTML);
    });

    it('1a', () => {
      assert.strictEqual(
        toc(parse('# 1\n\na')).outerHTML,
        html('ul', [
          html('li', [html('a', { href: '#index:1' }, '1')]),
        ]).outerHTML);
    });

    it('11', () => {
      assert.strictEqual(
        toc(parse('# 1\n\n# 2')).outerHTML,
        html('ul', [
          html('li', [html('a', { href: '#index:1' }, '1')]),
          html('li', [html('a', { href: '#index:2' }, '2')]),
        ]).outerHTML);
    });

    it('12', () => {
      assert.strictEqual(
        toc(parse('# 1\n\n## 2')).outerHTML,
        html('ul', [
          html('li', [
            html('a', { href: '#index:1' }, '1'),
            html('ul', [
              html('li', [html('a', { href: '#index:2' }, '2')]),
            ]),
          ]),
        ]).outerHTML);
    });

    it('121', () => {
      assert.strictEqual(
        toc(parse('# 1\n\n## 2\n\n# 3')).outerHTML,
        html('ul', [
          html('li', [
            html('a', { href: '#index:1' }, '1'),
            html('ul', [
              html('li', [html('a', { href: '#index:2' }, '2')]),
            ]),
          ]),
          html('li', [html('a', { href: '#index:3' }, '3')]),
        ]).outerHTML);
    });

    it('1232', () => {
      assert.strictEqual(
        toc(parse('# 1\n\n## 2\n\n### 3\n\n## 4')).outerHTML,
        html('ul', [
          html('li', [
            html('a', { href: '#index:1' }, '1'),
            html('ul', [
              html('li', [
                html('a', { href: '#index:2' }, '2'),
                html('ul', [
                  html('li', [html('a', { href: '#index:3' }, '3')]),
                ]),
              ]),
              html('li', [html('a', { href: '#index:4' }, '4')]),
            ]),
          ]),
        ]).outerHTML);
    });

    it('1231', () => {
      assert.strictEqual(
        toc(parse('# 1\n\n## 2\n\n### 3\n\n# 4')).outerHTML,
        html('ul', [
          html('li', [
            html('a', { href: '#index:1' }, '1'),
            html('ul', [
              html('li', [
                html('a', { href: '#index:2' }, '2'),
                html('ul', [
                  html('li', [html('a', { href: '#index:3' }, '3')]),
                ]),
              ]),
            ]),
          ]),
          html('li', [html('a', { href: '#index:4' }, '4')]),
        ]).outerHTML);
    });

    it('21', () => {
      assert.strictEqual(
        toc(parse('## 1\n\n# 2')).outerHTML,
        html('ul', [
          html('li', [html('a', { href: '#index:1' }, '1')]),
          html('li', [html('a', { href: '#index:2' }, '2')]),
        ]).outerHTML);
    });

  });

});
