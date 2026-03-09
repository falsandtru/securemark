import { AnnotationParser } from '../inline';
import { State, Backtrack } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, precedence, state, constraint, surround, setBacktrack, lazy } from '../../combinator';
import { inline } from '../inline';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => constraint(State.annotation, surround(
  '((',
  precedence(1, state(State.annotation,
  trimBlankStart(some(union([inline]), ')', [[')', 1]])))),
  '))',
  false,
  [2, 1 | Backtrack.common, 3 | Backtrack.doublebracket],
  ([, ns], context) =>
    context.linebreak === 0
      ? new List([new Node(html('sup', { class: 'annotation' }, [html('span', defrag(unwrap(trimBlankNodeEnd(ns))))]))])
      : undefined,
  (_, context): undefined => {
    const { source, position, range, linebreak } = context;
    const head = position - range;
    if (source[position] !== ')') {
      setBacktrack(context, 2 | Backtrack.common, head + 1);
    }
    else if (linebreak !== 0) {
      setBacktrack(context, 2 | Backtrack.doublebracket, head + 1);
    }
  })));
