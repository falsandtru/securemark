import { Result, eval, exec } from './combinator/data/parser';
import { html, define } from 'typed-dom/dom';
import { querySelector, querySelectorAll } from 'typed-dom/query';

export function inspect(result: Result<HTMLElement | string>, until: number | string = Infinity): Result<string> {
  return result && [
    eval(result).map((node, i, nodes) => {
      assert(node || node === '' && '([{'.includes(nodes[i + 1][0]));
      if (typeof node === 'string') return node;
      node = node.cloneNode(true);
      assert(!querySelector(node, '.invalid[data-invalid-message$="."]'));
      querySelectorAll(node, '.invalid').forEach(el => {
        assert(el.matches('[data-invalid-syntax][data-invalid-type][data-invalid-message]'));
        define(el, {
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null,
        });
      });
      until = typeof until === 'number'
        ? until
        : ~(~node.outerHTML.indexOf(until) || -Infinity) + until.length;
      const el = html('div');
      assert(!node.outerHTML.match(/[\x00-\x08\x0B-\x1F\x7F]/));
      el.innerHTML = node.outerHTML.slice(0, until);
      if (node.outerHTML.length <= until) {
        assert(node.outerHTML === el.innerHTML);
        // eslint-disable-next-line redos/no-vulnerable
        assert(node.childNodes.length === el.firstChild?.childNodes.length || />[^<]{65537}/.test(node.outerHTML));
      }
      else {
        assert(el.innerHTML.startsWith(node.outerHTML.slice(0, until)));
      }
      return normalize(node.outerHTML.slice(0, until));
    }),
    exec(result)
  ];
}

// Bug: Firefox
export function normalize(html: string): string {
  return html
    .replace(/(data-number="[\w.]+") (hidden="")/g, '$2 $1')
    .replace(/(data-type="[\w-]+") (type="\w+")/g, '$2 $1');
}
