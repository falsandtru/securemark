import { AnnotationParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\(\([\s\S]+?\)\)/;
const closer = /^\)\)/;

export const annotation: AnnotationParser = (source: string) => {
  if (!validate(source, '((', syntax)) return;
  return transform(
    bracket(
      '((',
      loop(combine<HTMLElement | Text, AnnotationParser.InnerParsers>([inline]), closer),
      '))'),
    (ns, rest) => {
      const el = document.createElement('sup');
      void el.setAttribute('class', 'annotation');
      void el.appendChild(squash(ns));
      if (el.textContent!.trim() === '') return;
      return [[el], rest];
    })
    (source);
};
