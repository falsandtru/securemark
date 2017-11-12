import { Parser } from './parser';

export function combine<R, P extends Parser<R, any>[]>(parsers: P): Parser<R, P> {
  assert(parsers.every(f => !!f));
  return (source: string) => {
    let rest = source;
    const results: R[] = [];
    for (const parse of parsers) {
      if (rest === '') break;
      const r = parse(rest);
      if (!r) continue;
      void results.push(...r[0]);
      assert(r[1].length < rest.length);
      assert(rest.endsWith(r[1]));
      rest = r[1];
      break;
    }
    return rest.length < source.length
      ? [results, rest]
      : undefined;
  };
}
