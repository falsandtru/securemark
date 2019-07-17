import { AutolinkParser } from '../../inline';
import { union, some, subline, focus, verify, lazy } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { defrag } from '../../util';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = lazy(() => verify(
  hashref_,
  (_, rest) => !rest.startsWith('#')));

export const hashref_: AutolinkParser.HashrefParser = subline(union([
  focus(
    /^#[0-9]+/,
    tag =>
      [[html('a', { class: 'hashref', rel: 'noopener' }, tag)], '']),
  focus(
    /^(?:[a-zA-Z0-9]|[^\x00-\x7F\s])*#+/,
    defrag(some(unescsource))),
]));
