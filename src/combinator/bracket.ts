import { Parser, Result } from './parser';

export function bracket<P extends Parser<any, any>[], R>(start: string, parser: Parser<R, P>, end: string): Parser<R, P> {
  return (source: string): Result<R, P> => {
    if (start + end === '') return;
    if (!source.startsWith(start)) return;
    const result = parser(source.slice(start.length));
    return result
      ? result[1].startsWith(end)
        ? [result[0], result[1].slice(end.length)]
        : undefined
      : source.startsWith(start + end)
        ? [[], source.slice(start.length + end.length)]
        : undefined;
  };
}
