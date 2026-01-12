import { AnnotationParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { union, some, syntax, creation, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => creation(1, Recursion.ignore, surround(
  '((',
  constraint(State.annotation, false,
  syntax(1, State.annotation | State.media,
  trimBlankStart(some(union([inline]), ')', [['\n', 9], [')', 1]])))),
  '))',
  false,
  ([, ns], rest) =>
    trimBlankNodeEnd(ns).length > 0
      ? [[html('sup', { class: 'annotation' }, [html('span', defrag(ns))])], rest]
      : undefined,
  undefined, 1 | Backtrack.bracket)));
