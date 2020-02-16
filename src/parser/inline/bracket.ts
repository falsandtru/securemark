import { BracketParser, inline } from '../inline';
import { union, some, open, close, lazy } from '../../combinator';
import { char } from '../source';

export const bracket: BracketParser = lazy(() => union([
  open(
    char('('), close(
    some(inline, ')'),
    char(')'), true, void 0,
    (ns, rest) => [ns, rest]), true),
  open(
    char('['), close(
    some(inline, ']'),
    char(']'), true, void 0,
    (ns, rest) => [ns, rest]), true),
  open(
    char('{'), close(
    some(inline, '}'),
    char('}'), true, void 0,
    (ns, rest) => [ns, rest]), true),
]));
