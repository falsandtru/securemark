import { AutolinkParser } from '../../inline';
import { State } from '../../context';
import { union, state, constraint, verify, rewrite } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = rewrite(verify(
  str(/^[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,255}@[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*(?![0-9a-z])/i),
  ([source]) => source.length <= 255),
  union([
    constraint(State.autolink, false, state(State.autolink,
      ({ source }) => [[html('a', { class: 'email', href: `mailto:${source}` }, source)], ''])),
    ({ source }) => [[source], ''],
  ]));
