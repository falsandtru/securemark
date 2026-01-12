import { AutolinkParser } from '../../inline';
import { syntax, creation, constraint, verify, rewrite } from '../../../combinator';
import { str } from '../../source';
import { State, Recursion } from '../../context';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = creation(1, Recursion.ignore, rewrite(verify(
  str(/^[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,255}@[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*(?![0-9a-z])/i),
  ([source]) => source.length <= 255),
  constraint(State.autolink, false, syntax(0, State.autolink,
    ({ source }) => [[html('a', { class: 'email', href: `mailto:${source}` }, source)], '']))));
