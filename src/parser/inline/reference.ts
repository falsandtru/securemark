import { ReferenceParser } from '../inline';
import { Input, State, Backtrack, Command } from '../context';
import { Result, List, Node } from '../../combinator/parser';
import { union, subsequence, some, precedence, state, constraint, backtrack, surround, open, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { beforeNonblank, trimBlankNodeEnd } from '../visibility';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => constraint(State.reference, backtrack(surround(
  '[[',
  precedence(1, state(State.annotation | State.reference,
  subsequence([
    abbr,
    open(beforeNonblank, some(inline, ']', [[']', 1]])),
  ]))),
  ']]',
  false,
  [2, 1 | Backtrack.common, 3 | Backtrack.doublebracket],
  ([, ns], input, output) => {
    const { position, range, linebreak } = input;
    const head = position - range;
    if (linebreak !== 0) {
      setBacktrack(input, 2 | Backtrack.link, head, 2);
      return;
    }
    return output.import(new List([
      new Node(html('sup', attributes(ns), [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))
    ]));
  },
  (_, input) => {
    const { source, position, range, linebreak } = input;
    const head = position - range;
    if (source[position] !== ']') {
      setBacktrack(input, 2 | Backtrack.common, head, 2);
    }
    else if (linebreak !== 0) {
      setBacktrack(input, 2 | Backtrack.doublebracket | Backtrack.link | Backtrack.ruby, head, 2);
    }
    else if (source[position + 1] !== '{') {
      setBacktrack(input, 2 | Backtrack.link, head + 1);
    }
    else {
      assert(source[position] === ']');
      assert(~input.state & State.link);
      input.position += 1;
      assert(!isBacktrack(input, 1 | Backtrack.link));
      input.memory = {
        position,
        range,
        head,
      };
      return cont;
    }
  }))));

interface Memory {
  readonly position: number;
  readonly range: number;
  readonly head: number;
}
const cont: Result<HTMLElement | string, Input<Memory>> = [
  (_, output) => {
    output.push();
    return output.context;
  },
  lazy(() => textlink),
  (input, output) => {
    const { memory: { position, range, head } } = input;
    if (output.state) {
      setBacktrack(input, 2 | Backtrack.link, head + 1);
    }
    input.position = position;
    input.range = range;
    output.pop();
    return Result.fail;
  },
];

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = backtrack(surround(
  str('^'),
  union([str(/(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/y)]),
  /\|?(?=]])|\|/y,
  true, [],
  ([, ns], input, output) => {
    const { source, position, range } = input;
    if (!ns) return output.import(new List([
      new Node(''),
      new Node(source.slice(position - range, source[position - 1] === '|' ? position - 1 : position)),
    ]));
    input.position += source[position] === ' ' ? 1 : 0;
    return output.import(new List([new Node(Command.Separator), new Node(ns.head!.value.trimEnd())]));
  },
  (_, input, output) => {
    input.position -= input.range;
    return output.append(new Node(''));
  }));

function attributes(ns: List<Node<string | HTMLElement>>): Record<string, string | undefined> {
  switch (ns.head!.value) {
    case '':
      return { class: 'invalid', ...invalid('reference', 'syntax', 'Invalid abbreviation') };
    case Command.Separator:
      const abbr = ns.head!.next!.value as string;
      ns.head!.value = ns.head!.next!.value = '';
      return { class: 'reference', 'data-abbr': abbr };
    default:
      return { class: 'reference' };
  }
}
