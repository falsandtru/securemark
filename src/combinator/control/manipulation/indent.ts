import { undefined } from 'spica/global';
import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { line } from '../constraint/line';
import { bind } from '../monad/bind';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';
import { Cache } from 'spica/cache';
import { join } from 'spica/array';

export function indent<P extends Parser<unknown>>(parser: P): P;
export function indent<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return bind(match(
    /^(?=(([^\S\n])\2*))/,
    memoize<string[], Parser<string>, string>(
    ([, indent]) =>
      some(line(open(indent, source => [[unline(source)], '']))),
    ([, indent]) => indent,
    new Cache(10))),
    (nodes, rest, context) => {
      const result = parser(join(nodes, '\n'), context);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : undefined;
    });
}

function unline(line: string): string {
  return line === ''
      || line[line.length - 1] !== '\n'
    ? line
    : line.slice(0, -1);
}
