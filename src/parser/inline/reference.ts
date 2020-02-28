import { ReferenceParser } from '../inline';
import { Result, subsequence, some, subline, focus, creator, surround, guard, context, lazy, bind } from '../../combinator';
import { startTight, isTight, trimEnd, defrag, stringify } from '../util';
import { inline } from '../inline';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => creator(subline(bind(surround(
  '[[',
  guard(context => context.syntax?.inline?.reference ?? true,
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    extension: false,
    media: false,
    // Redundant
    //link: true,
    //autolink: true,
  }}, state: void 0 },
  subsequence([alias, startTight(some(inline, ']]'))]))),
  ']]'),
  (ns, rest) =>
    isTight(ns, typeof ns[0] === 'object' && ns[0].tagName === 'ABBR' ? 1 : 0, ns.length)
      ? Result(
          html('sup',
            {
              class: 'reference',
              'data-alias': typeof ns[0] === 'object' && ns[0].tagName === 'ABBR'
                ? stringify(ns.shift()!)
                : void 0
            },
            defrag(trimEnd(ns))),
          rest)
      : void 0))));

const alias: ReferenceParser.AliasParser = creator(focus(
  /^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/,
  source => [[html('abbr', source.slice(1, ~(~source.lastIndexOf('|') || ~source.length)))], '']));
