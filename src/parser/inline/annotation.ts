import { AnnotationParser } from '../inline';
import { union, some, context, syntax, constraint, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { Syntax, State } from '../context';
import { startLoose, trimNode } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => surround(
  '((',
  constraint(State.annotation, false,
  syntax(Syntax.none, 6, 1, State.annotation | State.media,
  startLoose(
  context({ delimiters: undefined },
  some(union([inline]), ')', [[/^\\?\n/, 9], [')', 2], ['))', 6]])), ')'))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNode(defrag(ns)))])], rest]));
