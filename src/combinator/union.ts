import { Parser, SubParsers, exec, validate } from './parser';

export function union<P extends Parser<any, any>>(parsers: SubParsers<P>): P;
export function union<T, S extends Parser<T, any>[]>(parsers: S): Parser<T, S> {
  assert(parsers.every(f => !!f));
  switch (parsers.length) {
    case 0:
      return () => undefined;
    case 1:
      return parsers[0];
    default:
      return source => {
        const result = parsers[0](source);
        validate(source, result);
        if (!result) return union(parsers.slice(1))(source);
        return exec(result).length < source.length
          ? result
          : undefined;
      };
  }
}
