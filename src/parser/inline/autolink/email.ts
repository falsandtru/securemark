import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { union, state, constraint, verify, rewrite, surround } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = rewrite(
  surround(
    str(/[0-9a-z]/yi),
    verify(
      str(/(?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,255}@[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*(?![0-9a-z])/yi),
      ([source]) => source.length <= 255 - 1),
    '',
    false, undefined, undefined,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink,
      ({ context: { source } }) => [[html('a', { class: 'email', href: `mailto:${source}` }, source)]])),
    ({ context: { source } }) => [[source]],
  ]));
