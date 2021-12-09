import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, creator, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { startLoose, visible, trimNode } from '../util';
import { html, defrag } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(validate('((', '))', '\n', fmap(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  startLoose(visible(
  context({ syntax: { inline: {
    annotation: false,
    // Redundant
    //reference: true,
    media: false,
    // Redundant
    //index: true,
    //label: true,
    //link: true,
    //autolink: true,
  }}, state: undefined },
  union([some(inline, ')', /^\\?\n/)]))))),
  '))'),
  ns => [html('sup', { class: 'annotation' }, trimNode(defrag(ns)))]))));
