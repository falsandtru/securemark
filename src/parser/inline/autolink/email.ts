import { AutolinkParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { Node } from '../../../combinator/parser';
import { state, constraint, backtrack, verify, surround } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = constraint(State.autolink, state(State.autolink,
  backtrack(surround(
    /(?<![0-9a-z][_.+-]?|[@#])(?=[0-9a-z])/yi,
    verify(
      str(/[0-9a-z](?:[_.+-](?=[0-9a-z])|[0-9a-z]){0,63}@[0-9a-z](?:[.-](?=[0-9a-z])|[0-9a-z]){0,254}(?![_.-]?[0-9a-z@#]|>>|:\S)/yi),
      (_, output) => output.peek().head!.value.length <= 254),
    '',
    false,
    [3 | Backtrack.unescapable],
    ([, [{ value }]], _, output) =>
      output.append(new Node(html('a', { class: 'email', href: `mailto:${value}` }, value)))))));
