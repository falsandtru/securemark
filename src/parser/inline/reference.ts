import { ReferenceParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, subsequence, some, precedence, state, constraint, surround, isBacktrack, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { textlink } from './link';
import { str } from '../source';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const reference: ReferenceParser = lazy(() => constraint(State.reference, surround(
  str('[['),
  precedence(1, state(State.annotation | State.reference,
  subsequence([
    abbr,
    trimBlankStart(some(inline, ']', [[']', 1]])),
  ]))),
  ']]',
  false,
  [2, 1 | Backtrack.common, 3 | Backtrack.doublebracket],
  ([, ns], context) => {
    const { position, range, linebreak } = context;
    if (linebreak === 0) {
      return new List([new Node(html('sup', attributes(ns), [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))]);
    }
    else {
      const head = position - range;
      setBacktrack(context, 2 | Backtrack.link, head, 2);
    }
  },
  (_, context): undefined => {
    const { source, position, range, linebreak } = context;
    const head = position - range;
    if (source[position] !== ']') {
      setBacktrack(context, 2 | Backtrack.common, head, 2);
    }
    else if (linebreak !== 0) {
      setBacktrack(context, 2 | Backtrack.doublebracket | Backtrack.link | Backtrack.ruby, head, 2);
    }
    else {
      assert(source[position] === ']');
      context.position += 1;
      if (source[context.position] !== '{' ||
          isBacktrack(context, 1 | Backtrack.link) ||
          !textlink({ context })) {
        setBacktrack(context, 2 | Backtrack.link, head + 1);
      }
      context.position = position;
    }
  })));

// Chicago-Style
const abbr: ReferenceParser.AbbrParser = surround(
  str('^'),
  union([str(/(?=[A-Z])(?:[0-9A-Za-z]'?|(?:[-.:]|\.?\??,? ?)(?!['\-.:?, ]))+/y)]),
  /\|?(?=]])|\|/y,
  true, [],
  ([, ns], context) => {
    const { source, position, range } = context;
    if (!ns) return new List([new Node(''), new Node(source.slice(position - range, source[position - 1] === '|' ? position - 1 : position))]);
    context.position += source[position] === ' ' ? 1 : 0;
    return new List([new Node(Command.Separator), new Node(ns.head!.value.trimEnd())]);
  },
  (_, context) => {
    context.position -= context.range;
    return new List([new Node('')]);
  });

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
