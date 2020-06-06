import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, creator, bind, surround, lazy } from '../../combinator';
import { startTight, isEndTight, trimEnd, defrag } from '../util';
import { inline } from '../inline';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(bind(surround(
  '((',
  validate(/^\S[\s\S]*\)\)/,
  guard(context => context.syntax?.inline?.annotation ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //extension: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  union([some(inline, ')')]))))),
  '))'),
  (ns, rest) =>
    isEndTight(ns)
      ? [[html('sup', { class: 'annotation' }, defrag(trimEnd(ns)))], rest]
      : undefined)));
