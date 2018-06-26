import { Result, eval, exec } from './combinator';

export function inspect(r: Result<HTMLElement | Text | string, any>): [string[], string] | undefined {
  return r
    ? [
        eval(r).map(n =>
          typeof n === 'string'
            ? n
            : n instanceof Element
              ? n.outerHTML
              : n.textContent!),
          exec(r)
      ]
    : r;
}
