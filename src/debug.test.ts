import { Result } from './combinator';

export function inspect(r: Result<HTMLElement | Text | string, any>): [string[], string] | undefined {
  return r
    ? [
        r[0].map(n =>
          typeof n === 'string'
            ? n
            : n instanceof Element
              ? n.outerHTML
              : n.textContent!),
          r[1]
      ]
    : r;
}
