import { ReferenceParser } from '../inline';
import { union, subsequence, some, syntax, creation, constraint, surround, lazy, fmap, bind } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax, State } from '../context';
import { startLoose, trimNode } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => surround(
  '[[',
  constraint(State.reference, false,
  syntax(Syntax.reference, 6, 1, State.annotation | State.reference | State.media,
  startLoose(
  subsequence([
    abbr,
    fmap(str('^'), ns => ['', ...ns]),
    some(inline, ']', [[/^\\?\n/, 9], [']', 2], [']]', 6]]),
  ]), ']'))),
  ']]',
  false,
  ([, ns], rest) => [[html('sup', attributes(ns), [html('span', trimNode(defrag(ns)))])], rest]));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = creation(bind(surround(
  '^',
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/),
  ([source], rest) => [['\n', source.trimEnd()], rest]));

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
