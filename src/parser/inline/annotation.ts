import { AnnotationParser, inline } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\(\([\s\S]+?\)\)/;
const closer = /^\)\)/;

export const annotation: AnnotationParser = function (source: string): [[HTMLElement], string] | undefined {
  if (!validate(source, '((', syntax)) return;
  const [cs, rest] = bracket(
    '((',
    loop(combine<HTMLElement | Text, AnnotationParser.InnerParsers>([inline]), closer),
    '))',
  )(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('sup');
  void el.setAttribute('class', 'annotation');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest];
};
