import { AnnotationParser } from '../inline';
import { State, Backtrack, BacktrackState } from '../context';
import { union, some, precedence, state, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => constraint(State.annotation, false, surround(
  '((',
  precedence(1, state(State.annotation | State.media,
  trimBlankStart(some(union([inline]), ')', [['\n', 9], [')', 1]])))),
  '))',
  false,
  ([, ns], rest) =>
    trimBlankNodeEnd(ns).length > 0
      ? [[html('sup', { class: 'annotation' }, [html('span', defrag(ns))])], rest]
      : undefined,
  undefined, [1 | Backtrack.linebracket], Backtrack.bracket | BacktrackState.nobreak)));
