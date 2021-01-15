import { UListParser } from '../block';
import { union, inits, subsequence, some, block, line, validate, indent, focus, context, creator, open, convert, trim, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { olist_ } from './olist';
import { ilist_ } from './ilist';
import { inline } from '../inline';
import { unshift } from 'spica/array';
import { html } from 'typed-dom';

export const ulist: UListParser = lazy(() => block(fmap(validate(
  /^-(?=[^\S\n]|\n[^\S\n]*\S)/,
  context({ syntax: { inline: { media: false } } },
  some(creator(union([
    fmap(
      inits([
        line(open(/^-(?:$|\s)/, trim(subsequence([checkbox, trim(some(inline))])), true)),
        indent(union([ulist_, olist_, ilist_]))
      ]),
      ns => [html('li', defrag(fillFirstLine(ns)))]),
  ]))))),
  es => [html('ul', es)])));

export const checkbox = focus(
  /^\[[xX\s]\](?=$|\s)/,
  source => [[
    html('span', { class: 'checkbox' }, source[1].trimStart() ? '☑' : '☐'),
  ], '']);

export const ulist_: UListParser = convert(
  source => source.replace(/^-(?=$|\n)/, `$& `),
  ulist);

export function fillFirstLine(ns: (HTMLElement | string)[]): (HTMLElement | string)[] {
  return typeof ns[0] === 'object' && ['UL', 'OL'].includes(ns[0].tagName)
    ? unshift([html('br')], ns)
    : ns;
}
