import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { union, subsequence, some, validate, focus, guard, context, creator, surround, lazy, fmap, bind } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { regBlankInlineStart, trimBlankInline, stringify } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => creator(validate('[[', ']]', '\n', fmap(surround(
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
    focus(/^\^[^\S\n]*/, source => [['', source], '']),
    trimBlankInline(some(inline, ']', /^\\?\n/)),
  ]))),
  ']]'),
  ns => [html('sup', attributes(ns), defrag(ns))]))));

const abbr: ReferenceParser.AbbrParser = creator(bind(surround(
  '^',
  union([str(/^(?![0-9]+\s?[|\]])[0-9A-Za-z]+(?:(?:-|(?=\W)(?!'\d)'?(?!\.\d)\.?(?!,\S),? ?)[0-9A-Za-z]+)*(?:-|'?\.?,? ?)?/)]),
  /^\|?(?=]])|^\|[^\S\n]*/),
  ([source], rest) => [[html('abbr', source)], rest.replace(regBlankInlineStart, '')]));

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
