import { AutolinkParser } from '../../inline';
import { union, some, subline, focus } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

export const account: AutolinkParser.AccountParser = subline(union([
  focus(
    /^@@+/,
    compress(some(unescsource))),
  focus(
    /^@[a-zA-Z0-9]+(?:-[0-9a-zA-Z]+)*/,
    source => [[html('a', { class: 'account', rel: 'noopener' }, source)], '']),
]));
