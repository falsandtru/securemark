import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { union, subsequence, some, validate, guard, context, creator, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isEndTight, stringify } from '../util';
import { html, defrag } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => creator(validate('[[', ']]', '\n', surround(
  '[[',
  guard(context => context.syntax?.inline?.reference ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //index: true,
    label: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  subsequence([abbr, startTight(some(inline, ']', /^\\?\n/))])))),
  ']]', false,
  ([, ns], rest) =>
    isEndTight(ns)
      ? [[html('sup', { class: 'reference', ...attributes(ns) }, defrag(ns))], rest]
      : undefined))));

const abbr: ReferenceParser.AbbrParser = creator(fmap(surround(
  '^',
  union([str(/^[A-Za-z][0-9A-Za-z]*(?:(?:['-]|[.,]? |\., )[0-9A-Za-z]+)*/)]),
  /^\|?(?=]])|^\|[^\S\n]?/),
  ([source]) => [html('abbr', source)]));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  return {
    'data-abbr': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
      ? stringify([ns.shift()!])
      : undefined
  };
}
