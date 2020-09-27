import { undefined } from 'spica/global';
import { ReferenceParser } from '../inline';
import { subsequence, some, focus, validate, guard, context, creator, bind, surround, lazy } from '../../combinator';
import { startTight, isEndTight, trimEnd, defrag, stringify } from '../util';
import { inline } from '../inline';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => creator(bind(surround(
  '[[',
  validate(/^\S[^\n]*\]\]/,
  guard(context => context.syntax?.inline?.reference ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //extension: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  subsequence([alias, startTight(some(inline, ']', /^\\?\n/))]))))),
  ']]'),
  (ns, rest) =>
    isEndTight(ns)
      ? [[html('sup', { class: 'reference', ...attributes(ns) }, defrag(trimEnd(ns)))], rest]
      : undefined)));

const alias: ReferenceParser.AliasParser = creator(focus(
  /^~[A-Za-z0-9]+(?:(?:['-]|[.,]? |\., )[A-Za-z0-9]+)*(?:(?=]])|\|(?:(?=]])| ))/,
  source => [[html('abbr', source.split('|', 1)[0].slice(1))], '']));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  return {
    'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
      ? stringify(ns.shift()!)
      : undefined
  };
}
