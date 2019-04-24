import { Result, eval, exec } from './combinator';
import { html } from 'typed-dom';

export function inspect(r: Result<string, any>): [string[], string] | undefined;
export function inspect(r: Result<HTMLElement | Text, any>): [string[], string] | undefined;
export function inspect(r: Result<HTMLElement | Text | string, any>): [string[], string] | undefined {
  return r
    ? [
        eval(r).map(n =>
          typeof n === 'string'
            ? n
            : n instanceof Element
              ? n.outerHTML
              : html('b', n.textContent!).innerHTML),
          exec(r)
      ]
    : r;
}
