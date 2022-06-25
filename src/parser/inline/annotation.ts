import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, guard, context, syntax, state, validate, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { optimize } from './link';
import { Rule, State } from '../context';
import { startLoose, trimNode } from '../visibility';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => validate('((', syntax(Rule.annotation, 6, surround(
  '((',
  guard(context => ~context.state! & State.annotation,
  state(State.annotation | State.media,
  startLoose(
  context({ delimiters: undefined },
  some(union([inline]), ')', [[/^\\?\n/, 9], [')', 2], ['))', 6]])), ')'))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNode(defrag(ns)))])], rest],
  ([, ns, rest], next) => next[0] === ')' ? undefined : optimize('((', ns, rest)))));
