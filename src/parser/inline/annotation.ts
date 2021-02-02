import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, creator, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { startTight, isEndTight, defrag } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(validate('((', '))', '\n', surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //index: true,
    label: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  union([some(inline, ')', /^\\?\n/)])))),
  '))', false,
  ([, ns], rest) =>
    isEndTight(ns)
      ? [[html('sup', { class: 'annotation' }, defrag(ns))], rest]
      : undefined))));
