import { MarkParser } from '../inline';
import { union, some, syntax, constraint, surround, open, lazy } from '../../combinator';
import { inline } from '../inline';
import { identity, text } from './extension/indexee';
import { str } from '../source';
import { startTight, blankWith } from '../visibility';
import { Syntax, State } from '../context';
import { unshift } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

export const mark: MarkParser = lazy(() => surround(
  str('==', '='),
  constraint(State.mark, false,
  syntax(Syntax.none, 1, 1, State.none,
  startTight(some(union([
    some(inline, blankWith('=='), [[/^\\?\n/, 9]]),
    open(some(inline, '=', [[/^\\?\n/, 9]]), mark),
  ]))))),
  str('=='), false,
  ([, bs], rest, { id }) => {
    const el = html('mark', defrag(bs));
    define(el, { id: identity(id, text(el), 'mark') });
    return [[el, html('a', { href: el.id ? `#${el.id}` : undefined })], rest];
  },
  ([as, bs], rest) => [unshift(as, bs), rest]));
