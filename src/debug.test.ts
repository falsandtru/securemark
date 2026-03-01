import { Result, Ctx, eval } from './combinator/data/parser';
import { html, define } from 'typed-dom/dom';
import { querySelectorWith, querySelectorAllWith } from 'typed-dom/query';

export function inspect(result: Result<DocumentFragment | HTMLElement | string>, ctx: Ctx, until: number | string = Infinity): [string[], string] | undefined {
  return result && [
    eval(result).foldl<string[]>((acc, { value: node }) => {
      assert(node);
      if (typeof node === 'string') return acc.push(node), acc;
      if (node instanceof DocumentFragment) return acc.push(html('div', [node]).innerHTML), acc;
      node = node.cloneNode(true);
      assert(!querySelectorWith(node, '.invalid[data-invalid-message$="."]'));
      querySelectorAllWith(node, '.invalid').forEach(el => {
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
      return acc.push(normalize(node.outerHTML.slice(0, until))), acc;
    }, []),
    ctx.source.slice(ctx.position),
  ];
}

// Bug: Firefox
export function normalize(html: string): string {
  return html
    .replace(/(data-number="[\w.]+") (hidden="")/g, '$2 $1')
    .replace(/(data-type="[\w-]+") (type="\w+")/g, '$2 $1');
}
