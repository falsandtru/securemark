import { ReferenceParser } from '../inline';
import { Result, Ctx, subsequence, some, subline, focus, creator, backtracker, surround, clear, guard, context, lazy, bind } from '../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../util';
import { inline } from '../inline';
import { str } from '../source';
import { html } from 'typed-dom';
import { DeepMutable } from 'spica/type';

export const reference: ReferenceParser = lazy(() => creator(bind(surround(
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
  subline(subsequence([alias, startTight(some(inline, ']]'))])))),
  backtracker(clear(str(']]')))),
  (ns, rest, context: DeepMutable<Ctx>) =>
    isTight(ns, 'id' in ns[0] && ns[0].tagName === 'ABBR' ? 1 : 0, ns.length) || context.resource && void --context.resource.backtrack
      ? Result(
          defrag(html('sup',
            {
              class: 'reference',
              'data-alias': 'id' in ns[0] && ns[0].tagName === 'ABBR'
                ? ns.shift()!.textContent
                : void 0
            },
            trimEnd(ns))),
          rest)
      : void 0)));

const alias: ReferenceParser.AliasParser = creator(focus(
  /^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/,
  source => [[html('abbr', source.slice(1, ~(~source.lastIndexOf('|') || ~source.length)))], '']));
