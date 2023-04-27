import { ReferenceParser } from '../inline';
import { union, subsequence, some, syntax, creation, constraint, surround, lazy, fmap, bind } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { Syntax, State } from '../context';
import { regBlankStart, startLoose, trimNode } from '../visibility';
import { stringify } from '../util';
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

const abbr: ReferenceParser.AbbrParser = creation(bind(surround(
  '^',
  union([str(/^(?=[0-9]*[A-Za-z])(?:[0-9A-Za-z]|['-](?!\1)|[.?]?,? ?(?![.?, ]))+/)]),
  /^\|?(?=]])|^\|[^\S\n]*/),
  ([source], rest) => [[html('abbr', source)], rest.replace(regBlankStart, '')]));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  return typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
    ? {
        class: 'reference',
        'data-abbr': stringify([ns.shift()!]).trimEnd(),
      }
    : ns[0] === ''
      ? {
          class: 'invalid',
          'data-invalid-syntax': 'reference',
          'data-invalid-type': 'syntax',
          'data-invalid-message': 'Invalid abbr',
        }
      : { class: 'reference' };
}
