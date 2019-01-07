import { AutolinkParser } from '../../inline';
import { union, some, subline, focus, verify } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { defrag } from '../../util';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(union([
  verify(focus(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*/,
    source => [[html('a', { class: 'account', rel: 'noopener' }, source)], '']),
    (_, rest) => !rest.startsWith('@')),
  focus(
    /^(?:@[a-zA-Z0-9.+_-]*)+/,
    defrag(some(unescsource))),
]));
