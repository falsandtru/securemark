import { Result, eval, exec } from './combinator/data/parser';
import { html, define } from 'typed-dom';

export function inspect(result: Result<HTMLElement | string>, until: number | string = Infinity): Result<string> {
  return result && [
    eval(result).map(node => {
      assert(node);
      if (typeof node === 'string') return node;
      node = node.cloneNode(true);
      [node, ...node.querySelectorAll('.invalid')].forEach(el =>
        define(el, {
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-description': null,
        }));
      until = typeof until === 'number'
        ? until
        : ~(~node.outerHTML.indexOf(until) || -Infinity) + until.length;
      const el = html('div');
      el.innerHTML = node.outerHTML.slice(0, until);
      assert(until === Infinity ? node.outerHTML === el.innerHTML : el.innerHTML.startsWith(node.outerHTML.slice(0, until)));
      assert(until !== Infinity || node.childNodes.length === el.firstChild?.childNodes.length);
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
