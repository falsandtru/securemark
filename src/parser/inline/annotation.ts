import { AnnotationParser } from '../inline';
import { union, some, syntax, creation, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { Syntax, State, Recursion } from '../context';
import { trimBlankStart, trimNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => creation(1, Recursion.ignore, surround(
  '((',
  constraint(State.annotation, false,
  syntax(Syntax.annotation, 6, State.annotation | State.media,
  trimBlankStart(some(union([inline]), ')', [[/^\\?\n/, 9], [')', 2], ['))', 6]])))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNodeEnd(defrag(ns)))])], rest])));
