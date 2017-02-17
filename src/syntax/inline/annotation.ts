import { Result } from '../../parser.d';
import { AnnotationParser, TextParser } from '../inline';
import { compose } from '../../parser/compose';
import { loop } from '../../parser/loop';
import { text, squash } from './text';

type SubParsers = [TextParser];

const syntax = /^\(\([\s\S]+?\)\)/;

export const annotation: AnnotationParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('((') || source.startsWith('(((') || !source.match(syntax)) return;
  const [cs, rest] = loop(compose<SubParsers, HTMLElement | Text>([text]), /^\)\)/)(source.slice(2)) || [[], ''];
  if (!rest.startsWith('))')) return;
  const el = document.createElement('sup');
  void el.setAttribute('class', 'annotation');
  void el.setAttribute('title', squash(cs).textContent!.trim());
  el.textContent = '*';
  return [[el], rest.slice(2)];
}
