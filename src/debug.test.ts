import { Result, eval, exec } from './combinator';
import { html, define } from 'typed-dom';

export function inspect(r: Result<HTMLElement | string>, until: number | string = Infinity): [string[], string] | undefined {
  return r
    ? [
        eval(r).map(n => {
          if (typeof n === 'string') return n;
          const m = html('div');
          n = n.cloneNode(true);
          [n, ...n.querySelectorAll('.invalid')].forEach(el =>
            define(el, {
              'data-invalid-syntax': null,
              'data-invalid-type': null,
              'data-invalid-description': null,
            }));
          until = typeof until === 'number'
            ? until
            : ~(~n.outerHTML.indexOf(until) || Infinity) + until.length;
          m.innerHTML = n.outerHTML.slice(0, until);
          assert(until === Infinity ? n.outerHTML === m.innerHTML : m.innerHTML.startsWith(n.outerHTML.slice(0, until)));
          assert(until !== Infinity || n.childNodes.length === m.firstChild?.childNodes.length);
          return n.outerHTML.slice(0, until);
        }),
        exec(r)
      ]
    : r;
}
