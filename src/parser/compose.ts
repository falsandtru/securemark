import { Parser } from '../parser.d';

export function compose<P extends Parser<R, any>[], R>(parsers: P): Parser<R, P> {
  return (source: string) => {
    let rest = source;
    const results: R[] = [];
    for (const parse of parsers) {
      const r = parse(source);
      if (!r) continue;
      void results.push(...r[0]);
      assert(r[1].length < rest.length);
      rest = r[1];
      break;
    }
    return source.length === rest.length
      ? void 0
      : [results, rest];
  };
}
