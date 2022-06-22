import { undefined } from 'spica/global';
import { AnnotationParser } from '../inline';
import { union, some, validate, guard, context, precedence, creator, recursion, surround, lazy } from '../../combinator';
import { inline } from '../inline';
import { optimize } from './link';
import { trimBlankStart, trimNodeEnd } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const annotation: AnnotationParser = lazy(() => creator(recursion(precedence(6, validate('((', surround(
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
  trimBlankStart(some(union([inline]), ')', [[/^\\?\n/, 9], [')', 3], ['))', 6]])))),
  '))',
  false,
  ([, ns], rest) => [[html('sup', { class: 'annotation' }, [html('span', trimNodeEnd(defrag(ns)))])], rest],
  ([, ns, rest], next) => next[0] === ')' ? undefined : optimize('((', ns, rest)))))));
