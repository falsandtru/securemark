import { ReferenceParser } from '../inline';
import { subsequence, some, subline, contract, verify, focus, surround, guard, configure, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => subline(verify(fmap(
  guard(config => config.syntax?.inline?.reference ?? true,
  configure({ syntax: { inline: { annotation: false, reference: false, media: false } } },
  surround('[[', subsequence([alias, trimNodeEnd(defrag(some(inline, /^\\?\n|^]]/)))]), ']]'))),
  ns => [
    html('sup',
      {
        class: 'reference',
        'data-alias': ns[0].nodeName === 'ABBR'
          ? ns.shift()!.textContent
          : undefined
      },
      ns)
  ]),
  ([el]) => hasTightText(el) || el.hasAttribute('data-alias'))));

const alias: ReferenceParser.AliasParser = subline(contract('~', focus(
  /^~[A-za-z][A-Za-z0-9', -]*(?:(?=]])|:(?:(?=]])| ))/,
  source =>
    !source.includes('  ')
      ? [[html('abbr', source.slice(1, ~(~source.indexOf(':', -2) || ~source.length)))], '']
      : void 0),
  ([el]) => hasTightText(el)));
