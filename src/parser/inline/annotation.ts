import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, precedence, creator, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { trimBlankStart, trimNodeEnd } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => creator(precedence(6, validate('((', fmap(surround(
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
  trimBlankStart(some(union([inline]), ')', [[/^\\?\n/, 9], ['))', 6]])))),
  '))'),
  ns => [html('sup', { class: 'annotation' }, [html('span', trimNodeEnd(defrag(ns)))])])))));
