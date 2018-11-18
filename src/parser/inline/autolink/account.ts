import { AutolinkParser } from '../../inline';
import { union, some, verify, subline, focus } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(union([
  verify(focus(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*/,
    source => [[html('a', { class: 'account', rel: 'noopener' }, source)], '']),
    (_, rest) => !rest.startsWith('@')),
  focus(
    /^(?:@[a-zA-Z0-9.+_-]*)+/,
    compress(some(unescsource))),
]));
