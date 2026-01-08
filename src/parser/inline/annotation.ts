import { AnnotationParser } from '../inline';
import { union, some, syntax, creation, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { trimBlankStart, trimNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => creation(1, Recursion.ignore, surround(
  '((',
  constraint(State.annotation, false,
  syntax(6, State.annotation | State.media,
  trimBlankStart(some(union([inline]), ')', [[/^\\?\n/, 9], [')', 2]])))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNodeEnd(defrag(ns)))])], rest],
  undefined, 1 | Backtrack.bracket)));
