import { AnnotationParser } from '../inline';
import { State, Backtrack } from '../context';
import { union, some, precedence, state, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => constraint(State.annotation, surround(
  '((',
  precedence(1, state(State.annotation,
  trimBlankStart(some(union([inline]), ')', [[')', 1]])))),
  '))',
  false,
  ([, ns], rest, context) =>
    context.linebreak === 0
      ? [[html('sup', { class: 'annotation' }, [html('span', defrag(trimBlankNodeEnd(ns)))])], rest]
      : undefined,
  undefined,
  [3 | Backtrack.doublebracket, 1 | Backtrack.bracket])));
