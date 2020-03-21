import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, creator, bind, surround, lazy } from '../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../util';
import { inline } from '../inline';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(bind(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  validate(/^\S[\s\S]*\)\)/,
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //extension: true,
    //link: true,
    //autolink: true,
  }}, state: void 0 },
  startTight(union([some(inline, ')')]))))),
  '))'),
  (ns, rest) =>
    isTight(ns, 0, ns.length)
      ? [[html('sup', { class: 'annotation' }, defrag(trimEnd(ns)))], rest]
      : void 0)));
