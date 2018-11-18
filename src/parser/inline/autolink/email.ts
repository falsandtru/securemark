import { AutolinkParser } from '../../inline';
import { union, some, verify, subline, focus } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { compress } from '../../util';
import { html } from 'typed-dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = subline(union([
  verify(focus(
    /^[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/,
    source => [[html('a', { class: 'email', href: `mailto:${source}`, rel: 'noopener' }, source)], '']),
    (_, rest) => !rest.startsWith('@')),
  focus(
    /^[a-zA-Z0-9][a-zA-Z0-9.+_-]*(?:@[a-zA-Z0-9.+_-]*)+/,
    compress(some(unescsource))),
]));
