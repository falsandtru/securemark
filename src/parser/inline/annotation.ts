import { AnnotationParser } from '../inline';
import { union, some, syntax, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { Syntax, State } from '../context';
import { trimBlankStart, trimNodeEnd } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => surround(
  '((',
  constraint(State.annotation, false,
  syntax(Syntax.none, 6, 1, State.annotation | State.media,
  trimBlankStart(some(union([inline]), ')', [[/^\\?\n/, 9], [')', 2], ['))', 6]])))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNodeEnd(defrag(ns)))])], rest]));
