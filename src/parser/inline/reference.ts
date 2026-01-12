import { ReferenceParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { union, subsequence, some, syntax, creation, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { blank, trimBlankStart, trimNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => creation(1, Recursion.ignore, surround(
  '[[',
  constraint(State.reference, false,
  syntax(1, State.annotation | State.reference | State.media,
  subsequence([
    abbr,
    trimBlankStart(some(inline, ']', [['\n', 9], [']', 1]])),
  ]))),
  ']]',
  false,
  ([, ns], rest) => [[html('sup', attributes(ns), [html('span', trimNodeEnd(defrag(ns)))])], rest],
  undefined, 1 | Backtrack.bracket)));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = creation(1, Recursion.ignore, surround(
  '^',
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/,
  true,
  ([, ns], rest) => ns ? [['\n', ns[0].trimEnd()], rest.replace(blank.start, '')] : [[''], `^${rest}`],
  ([, , rest]) => [[''], `^${rest}`]));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  switch (ns[0]) {
    case '':
      return {
        class: 'invalid',
        'data-invalid-syntax': 'reference',
        'data-invalid-type': 'syntax',
        'data-invalid-message': 'Invalid abbreviation',
      };
    case '\n':
      const abbr = ns[1] as string;
      ns[0] = ns[1] = '';
      return { class: 'reference', 'data-abbr': abbr };
    default:
      return { class: 'reference' };
  }
}
