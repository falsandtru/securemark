import { undefined } from 'spica/global';
import { Parser, eval, exec } from '../../data/parser';
import { some } from '../../data/parser/some';
import { block } from '../constraint/block';
import { line } from '../constraint/line';
import { bind } from '../monad/bind';
import { match } from './match';
import { open } from './surround';
import { memoize } from 'spica/memoize';

export function indent<P extends Parser<unknown>>(parser: P, separation?: boolean): P;
export function indent<P extends Parser<unknown>>(opener: RegExp, parser: P, separation?: boolean): P;
export function indent<T>(opener: RegExp | Parser<T>, parser?: Parser<T> | boolean, separation = false): Parser<T> {
  if (typeof opener === 'function') return indent(/(([ \t])\2*)/, opener, parser as boolean);
  assert(parser);
  return bind(block(match(
    new RegExp(String.raw`^(?=${opener.source})`),
    memoize(
    ([, indent]) =>
      some(line(open(indent, source => [[unline(source)], '']))),
    ([, indent]) => indent.length * 2 + +(indent[0] === ' '), [])), separation),
    (nodes, rest, context) => {
      assert(parser = parser as Parser<T>);
      const result = parser(nodes.join('\n'), context);
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
