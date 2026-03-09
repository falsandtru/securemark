import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/data/parser';
import { state, constraint, verify, surround } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = constraint(State.autolink, state(State.autolink,
  surround(
    /(?<![0-9a-z][_.+-]?|[@#])(?=[0-9a-z])/yi,
    verify(
      str(/[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,63}@[0-9a-z](?:[.-](?=[0-9a-z])|[0-9a-z]){0,254}(?![_.-]?[0-9a-z@#]|>>|:\S)/yi),
      ([{ value }]) => value.length <= 254),
    '',
    false,
    [3 | Backtrack.unescapable],
    ([, [{ value }]]) =>
      new List([new Node(html('a', { class: 'email', href: `mailto:${value}` }, value))]))));
