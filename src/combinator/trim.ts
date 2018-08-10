import { Parser } from './parser';

export function trim<P extends Parser<any, any>>(parser: P): P;
export function trim<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimWith(parser, source => source.trim());
}

function trimStart<P extends Parser<any, any>>(parser: P): P;
function trimStart<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimWith(parser, source => {
    const mid = source.trim();
    return source.slice(source.lastIndexOf(mid));
  });
}

function trimEnd<P extends Parser<any, any>>(parser: P): P;
function trimEnd<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimWith(parser, source => {
    const mid = source.trim();
    return source.slice(0, source.lastIndexOf(mid) + mid.length);
  });
}

function trimWith<T, S extends Parser<any, any>[]>(parser: Parser<T, S>, trim: (source: string) => string): Parser<T, S> {
  assert(parser);
  return source => {
    if (source === '') return;
    source = trim(source);
    return source !== ''
      ? parser(source)
      : [[], ''];
  };
}

export function trimLine<P extends Parser<any, any>>(parser: P): P;
export function trimLine<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return trimLineStart(trimLineEnd(parser));
}

function trimLineStart<P extends Parser<any, any>>(parser: P): P;
function trimLineStart<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return source =>
    source[0] === '\n'
      ? parser(source)
      : source.includes('\n')
        ? trimStart(s => parser(s + source.slice(source.indexOf('\n'))))(source.split('\n', 1)[0])
        : trimStart(parser)(source);
}

function trimLineEnd<P extends Parser<any, any>>(parser: P): P;
function trimLineEnd<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return source =>
    source[0] === '\n'
      ? parser(source)
      : source.includes('\n')
        ? trimEnd(s => parser(s + source.slice(source.indexOf('\n'))))(source.split('\n', 1)[0])
        : trimEnd(parser)(source);
}
