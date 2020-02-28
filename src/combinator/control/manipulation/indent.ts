import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { line, firstline } from '../constraint/line';
import { rewrite } from '../constraint/scope';
import { bind } from '../monad/bind';
import { match, memoize } from './match';
import { open } from './surround';
import { join } from 'spica/array';

export function indent<P extends Parser<unknown>>(parser: P): P;
export function indent<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return bind(match(
    /^(?=(([^\S\n])\2*))/,
    memoize(([, indent]) => indent,
    indent =>
      some(line(rewrite(
        source => [[], source.slice(firstline(source).length)],
        open(indent, source => [[firstline(source, false)], ''])))))),
    (rs, rest, context) => {
      const result = parser(join(rs, '\n'), context);
      return result && exec(result) === ''
        ? [eval(result), rest]
        : void 0;
    });
}
