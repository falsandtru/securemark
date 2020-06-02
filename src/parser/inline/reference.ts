import { ReferenceParser } from '../inline';
import { subsequence, some, subline, focus, validate, guard, context, creator, bind, surround, lazy } from '../../combinator';
import { startTight, isTight, trimEnd, defrag, stringify } from '../util';
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
  }}, state: void 0 },
  subline(subsequence([alias, startTight(some(inline, ']'))])))))),
  ']]'),
  (ns, rest) =>
    isTight(ns, typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? 1 : 0, ns.length)
      ? [[html('sup', { class: 'reference', ...attributes(ns) }, defrag(trimEnd(ns)))], rest]
      : void 0)));

const alias: ReferenceParser.AliasParser = creator(focus(
  /^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/,
  source => [[html('abbr', source.split('|', 1)[0].slice(1))], '']));

function attributes(ns: (string | HTMLElement)[]): Record<string, string | undefined> {
  return {
    'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
      ? stringify(ns.shift()!)
      : void 0
  };
}
