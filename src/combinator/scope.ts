import { Parser, eval, exec } from './parser';

export function focus<P extends Parser<any, any>>(scope: Parser<any, any>, parser: P): P;
export function focus<T, S extends Parser<any, any>[]>(scope: Parser<never, any>, parser: Parser<T, S>): Parser<T, S> {
  assert(scope);
  assert(parser);
  return source => {
    if (source === '') return;
    const ar = scope(source);
    if (!ar || exec(ar).length >= source.length) return;
    const br = parser(source.slice(0, source.length - exec(ar).length));
    if (!br || exec(br).length >= source.length) return;
    assert(exec(br)==='');
    assert(source.slice(1).endsWith(exec(br) + exec(ar)));
    return exec(br).length + exec(ar).length < source.length
      ? [eval(br), exec(br) + exec(ar)]
      : undefined;
  };
}
