import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { union, subsequence, some, context, creator, guard, syntax, state, validate, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { optimize } from './link';
import { str, stropt } from '../source';
import { Rule, State } from '../context';
import { regBlankStart, startLoose, trimNode } from '../visibility';
import { stringify } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => validate('[[', syntax(Rule.reference, 6, surround(
  '[[',
  guard(context => ~context.state! & State.reference,
  state(State.annotation | State.reference | State.media,
  startLoose(
  context({ delimiters: undefined },
  subsequence([
    abbr,
    open(stropt(/^(?=\^)/), some(inline, ']', [[/^\\?\n/, 9], [']', 2], [']]', 6]])),
    some(inline, ']', [[/^\\?\n/, 9], [']', 2], [']]', 6]]),
  ])), ']'))),
  ']]',
  false,
  ([, ns], rest) => [[html('sup', attributes(ns), [html('span', trimNode(defrag(ns)))])], rest],
  ([, ns, rest], next) => next[0] === ']' ? undefined : optimize('[[', ns, rest)))));

const abbr: ReferenceParser.AbbrParser = creator(bind(surround(
  '^',
  union([str(/^(?![0-9]+\s?[|\]])[0-9A-Za-z]+(?:(?:-|(?=\W)(?!'\d)'?(?!\.\d)\.?(?!,\S),? ?)[0-9A-Za-z]+)*(?:-|'?\.?,? ?)?/)]),
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
