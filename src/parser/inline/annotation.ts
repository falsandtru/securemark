import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, creator, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { trimBlankInline } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => creator(validate('((', '))', '\n', fmap(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
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
  }}, delimiters: undefined },
  trimBlankInline(union([some(inline, ')', /^\\?\n/)])))),
  '))'),
  ns => [html('sup', { class: 'annotation' }, defrag(ns))]))));
