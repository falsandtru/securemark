import { Parser } from '../parser';

export function combine<P extends Parser<R, any>[], R>(parsers: P): Parser<R, P> {
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
      rest = r[1];
      break;
    }
    return rest.length < source.length
      ? [results, rest]
      : void 0;
  };
}
