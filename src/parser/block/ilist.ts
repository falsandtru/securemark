import { IListParser, ListItemParser } from '../block';
import { union, inits, some, fmap, surround, verify, block, line, indent, focus, trim, build, eval } from '../../combinator';
import { contentline } from '../source/line';
import { ulist } from './ulist';
import { olist_ } from './olist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { html, frag } from 'typed-dom';

export const ilist: IListParser = block(fmap<IListParser>(build(() =>
  some(union([
    fmap(
      inits<ListItemParser>([
        line(focus(contentline, verify(surround(/^[-+*](?:\s|$)/, compress(trim(some(inline))), '', false), rs => !hasMedia(frag(rs))))),
        indent(union([ulist, olist_, ilist]))
      ]),
      () => [html('li', eval(some(inline)('Invalid syntax: UList syntax: Use `-` instead.')))])
  ]))),
  es => [html('ul', { class: 'invalid' }, es)]));
