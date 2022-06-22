import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { Result } from '../../combinator/data/parser';
import { union, subsequence, some, validate, guard, context, precedence, creator, surround, open, lazy, bind } from '../../combinator';
import { inline } from '../inline';
import { bracket } from './bracket';
import { str, stropt } from '../source';
import { regBlankStart, trimBlankStart, trimNodeEnd, stringify } from '../util';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

export const reference: ReferenceParser = lazy(() => validate('[[', creator(precedence(6, surround(
  '[[',
  guard(context => context.syntax?.inline?.reference ?? true,
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //index: true,
    //label: true,
    //link: true,
    //autolink: true,
  }}, delimiters: undefined },
  subsequence([
    abbr,
    open(stropt(/^(?=\^)/), some(inline, ']', [[/^\\?\n/, 9], [']]', 6]])),
    trimBlankStart(some(inline, ']', [[/^\\?\n/, 9], [']]', 6]])),
  ]))),
  ']]',
  false,
  ([, ns], rest) => [[html('sup', attributes(ns), [html('span', trimNodeEnd(defrag(ns)))])], rest],
  ([, , rest], next, context) =>
    next[0] === ']' ? undefined : bracket2(`[[${rest}`, context) as Result<string | HTMLElement, typeof context>)))));

const abbr: ReferenceParser.AbbrParser = creator(bind(surround(
  '^',
  union([str(/^(?![0-9]+\s?[|\]])[0-9A-Za-z]+(?:(?:-|(?=\W)(?!'\d)'?(?!\.\d)\.?(?!,\S),? ?)[0-9A-Za-z]+)*(?:-|'?\.?,? ?)?/)]),
  /^\|?(?=]])|^\|[^\S\n]*/),
  ([source], rest) => [[html('abbr', source)], rest.replace(regBlankStart, '')]));

const bracket2 = union([
  surround(str('['), bracket, str(']'), false,
    undefined,
    ([as, bs = []], rest) => [unshift(as, bs), rest]),
]);

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
