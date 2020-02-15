import { ReferenceParser } from '../inline';
import { subsequence, some, subline, focus, creator, backtracker, surround, guard, update, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { defrag, startTight } from '../util';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => creator(fmap(surround(
  '[[',
  guard(context => context.syntax?.inline?.reference ?? true,
  subline(
  update({ syntax: { inline: {
    annotation: false,
    reference: false,
    extension: true,
    media: false,
    link: true,
    autolink: true,
  }}},
  startTight(subsequence([alias, some(inline, ']]')]))))),
  backtracker(str(']]'))),
  ns => [
    defrag(html('sup',
      {
        class: 'reference',
        'data-alias': ns[0].nodeName === 'ABBR'
          ? ns.shift()!.textContent
          : undefined
      },
      ns))
  ])));

const alias: ReferenceParser.AliasParser = creator(focus(
  /^~[A-za-z][A-Za-z0-9',-]*(?: [A-Za-z0-9',-]+)*(?:(?=]])|\|(?:(?=]])| ))/,
  source => [[html('abbr', source.slice(1, ~(~source.indexOf('|', -2) || ~source.length)))], '']));
