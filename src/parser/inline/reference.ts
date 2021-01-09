import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { union, subsequence, some, validate, guard, context, creator, surround, lazy, fmap, bind } from '../../combinator';
import { startTight, isEndTight, defrag, stringify } from '../util';
import { inline } from '../inline';
import { str } from '../source';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => creator(validate('[[', ']]', '\n', bind(surround(
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
  subsequence([alias, startTight(some(inline, ']', /^\\?\n/))])))),
  ']]'),
  (ns, rest) =>
    isEndTight(ns)
      ? [[html('sup', { class: 'reference', ...attributes(ns) }, defrag(ns))], rest]
      : undefined))));

const alias: ReferenceParser.AliasParser = creator(fmap(surround(
  '^',
  union([str(/^[0-9A-Za-z]+(?:(?:['-]|[.,]? |\., )[0-9A-Za-z]+)*/)]),
  /^\|?(?=]])|^\|[^\S\n]?/),
  ([source]) => [html('abbr', source)]));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  return {
    'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
      ? stringify(ns.shift()!)
      : undefined
  };
}
