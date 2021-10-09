import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, creator, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { startTight, trimEnd } from '../util';
import { html, defrag } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(validate('((', '))', '\n', fmap(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  startTight(
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    media: false,
    // Redundant
    //index: true,
    //label: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  union([some(inline, ')', /^\\?\n/)])))),
  '))'),
  ns => [html('sup', { class: 'annotation' }, trimEnd(defrag(ns)))]))));
