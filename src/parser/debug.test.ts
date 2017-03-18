import { Result } from '../parser';

export function inspect(r: Result<HTMLElement | Text, any>): [string[], string] | undefined {
  return r
    ? [
        r[0].map(n =>
        n instanceof Text
            ? n.textContent!
            : n.outerHTML),
        r[1]
      ]
    : r;
}
