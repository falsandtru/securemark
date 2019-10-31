import { Result, eval, exec } from './combinator';
import { html } from 'typed-dom';

export function inspect(r: Result<string, any, object, object>): [string[], string] | undefined;
export function inspect(r: Result<HTMLElement | Text, any, object, object>): [string[], string] | undefined;
export function inspect(r: Result<HTMLElement | Text | string, any, object, object>): [string[], string] | undefined {
  return r
    ? [
        eval(r).map(n => {
          if (typeof n === 'string') return n;
          if (n instanceof Text) return html('b', n.textContent!).innerHTML;
          const m = html('div');
          m.innerHTML = n.outerHTML;
          assert(n.outerHTML === m.innerHTML);
          return n.outerHTML;
        }),
        exec(r)
      ]
    : r;
}
