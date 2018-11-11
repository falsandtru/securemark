﻿import { IListParser, ListItemParser } from '../block';
import { union, inits, some, fmap, surround, verify, block, line, indent, rewrite, trim, lazy, eval } from '../../combinator';
import { contentline } from '../source/line';
import { ulist } from './ulist';
import { olist_ } from './olist';
import { compress, hasMedia } from '../util';
import { html, frag } from 'typed-dom';
import { inblock } from '../inblock';

export const ilist: IListParser = block(fmap<IListParser>(lazy(() =>
  some(union([
    fmap(
      inits<ListItemParser>([
        line(rewrite(contentline, verify(surround(/^[-+*](?:\s|$)/, compress(trim(some(inblock))), '', false), rs => !hasMedia(frag(rs))))),
        indent(union([ulist, olist_, ilist]))
      ]),
      () => [html('li', eval(some(inblock)('Invalid syntax: UList: Use `-` instead.')))])
  ]))),
  es => [html('ul', { class: 'invalid', 'data-invalid-type': 'syntax' }, es)]));
