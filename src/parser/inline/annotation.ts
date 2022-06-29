import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, context, syntax, constraint, state, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { optimize } from './link';
import { Syntax, State } from '../context';
import { startLoose, trimNode } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => surround(
  '((',
  constraint(State.annotation, false,
  syntax(Syntax.annotation, 6, 1,
  state(State.annotation | State.media,
  startLoose(
  context({ delimiters: undefined },
  some(union([inline]), ')', [[/^\\?\n/, 9], [')', 2], ['))', 6]])), ')')))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNode(defrag(ns)))])], rest],
  ([, ns, rest], next, context) => next[0] === ')' ? undefined : optimize('((', ns, rest, next, context)));
