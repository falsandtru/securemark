import { ReferenceParser } from '../inline';
import { union, subsequence, some, syntax, creation, constraint, surround, lazy } from '../../combinator';
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
    some(inline, ']', [[/^\\?\n/, 9], [']', 2], [']]', 6]]),
  ]), ']'))),
  ']]',
  false,
  ([, ns], rest) => [[html('sup', attributes(ns), [html('span', trimNode(defrag(ns)))])], rest]));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = creation(surround(
  '^',
  union([str(/^(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/,
  true,
  ([, ns], rest) => [ns ? ['\n', ns[0].trimEnd()] : ['', '^'], rest],
  ([, , rest]) => [['', '^'], rest]));

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
