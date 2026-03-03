import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { union, state, constraint, verify, rewrite, open } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = rewrite(
  open(/(?<![0-9a-z][_.+-]?|[@#])(?=[0-9a-z])/yi,
    verify(
      str(/[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,255}@[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=[0-9a-z])){0,61}[0-9a-z])?)*(?![.-]?[0-9a-z@#]|>>|:\S)/yi),
      ([{ value }]) => value.length <= 255),
    false,
    [3 | Backtrack.autolink]),
  constraint(State.autolink, state(State.autolink,
    union([
      ({ context: { source } }) =>
        new List([new Data(html('a', { class: 'email', href: `mailto:${source}` }, source))])
    ]))));
