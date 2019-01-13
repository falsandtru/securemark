import { IListParser, ListItemParser } from '../block';
import { union, inits, some, block, line, verify, surround, indent, trim, lazy, fmap, eval } from '../../combinator';
import { ulist } from './ulist';
import { olist_ } from './olist';
import { defrag, hasMedia } from '../util';
import { html, frag } from 'typed-dom';
import { inline } from '../inline';

export const ilist: IListParser = lazy(() => block(fmap(
  some(union([
    fmap(
      inits<ListItemParser>([
        line(verify(surround(/^[-+*](?:\s|$)/, defrag(trim(some(inline))), '', false), rs => !hasMedia(frag(rs)))),
        indent(union([ulist, olist_, ilist]))
      ]),
      () => [html('li', eval(some(inline)('Invalid syntax: UList: Use `-` instead.')))])
  ])),
  es => [html('ul', { class: 'invalid', 'data-invalid-syntax': 'list', 'data-invalid-type': 'syntax' }, es)])));
