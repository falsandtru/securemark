import { ReferenceParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { union, subsequence, some, precedence, state, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { blank, trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';
import { invalid } from '../util';

export const reference: ReferenceParser = lazy(() => constraint(State.reference, false, surround(
  str('[['),
  precedence(1, state(State.annotation | State.reference | State.media,
  subsequence([
    abbr,
    trimBlankStart(some(inline, ']', [[']', 1]])),
  ]))),
  ']]',
  false,
  ([, ns], rest, context) =>
    context.linebreak === undefined &&
    trimBlankNodeEnd(ns).length > 0
      ? [[html('sup', attributes(ns), [html('span', defrag(ns))])], rest]
      : undefined,
  ([as, bs], rest, { state = 0 }) =>
    state & State.annotation
      ? [unshift(as, bs), rest]
      : undefined,
  [3 | Backtrack.doublebracket, 1 | Backtrack.bracket])));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = surround(
  '^',
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/,
  true,
  ([, ns], rest) => ns ? [[Command.Escape, ns[0].trimEnd()], rest.replace(blank.start, '')] : [[''], `^${rest}`],
  ([, , rest]) => [[''], `^${rest}`]);

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  switch (ns[0]) {
    case '':
      return { class: 'invalid', ...invalid('reference', 'syntax', 'Invalid abbreviation') };
    case Command.Escape:
      const abbr = ns[1] as string;
      ns[0] = ns[1] = '';
      return { class: 'reference', 'data-abbr': abbr };
    default:
      return { class: 'reference' };
  }
}
