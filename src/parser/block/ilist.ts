import { IListParser } from '../block';
import { union, inits, some, surround, verify, indent, fmap, trim, build } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { ulist } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { html } from 'typed-dom';

export const ilist: IListParser = block(fmap<IListParser>(build(() =>
  some(fmap(
    inits<IListParser>([
      line(verify(surround(/^[-+*](?:\s|$)/, compress(trim(some(inline))), '', false), rs => !hasMedia(html('b', rs))), true, true),
      indent(union([ulist, olist_, ilist]))
    ]),
    () =>
      [html('li', some(inline)('*Invalid syntax: UList syntax: Use `-` instead.*')![0])]))),
  es =>
    [html('ul', es)]));
