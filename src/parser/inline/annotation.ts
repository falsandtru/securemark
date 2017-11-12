import { Result, combine, loop, bracket } from '../../combinator';
import { AnnotationParser, InlineParser, inline } from '../inline';
import { squash } from '../squash';
import { validate } from '../source/validation';

type SubParsers = [InlineParser];

const syntax = /^\(\([\s\S]+?\)\)/;
const closer = /^\)\)/;

export const annotation: AnnotationParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!validate(source, '((', syntax)) return;
  const [cs, rest] = bracket('((', loop(combine<SubParsers, HTMLElement | Text>([inline]), closer), '))')(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('sup');
  void el.setAttribute('class', 'annotation');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest];
};
