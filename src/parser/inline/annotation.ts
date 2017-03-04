import { Result } from '../../parser';
import { AnnotationParser, InlineParser, inline, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';

type SubParsers = [InlineParser];

const syntax = /^\(\([\s\S]+?\)\)/;
const closer = /^\)\)(?!\))/;

export const annotation: AnnotationParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('((') || !source.match(syntax)) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.slice(2)) || [[], ''];
  if (!rest.startsWith('))')) return;
  const el = document.createElement('sup');
  void el.setAttribute('class', 'annotation');
  void el.appendChild(squash(cs));
  return [[el], rest.slice(2)];
};
