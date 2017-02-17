import { Result } from '../../parser.d';
import { StrongParser, InlineParser, inline } from '../inline';
import { compose } from '../../parser/compose';
import { loop } from '../../parser/loop';
import { squash } from './text';

type SubParsers = [InlineParser];

const syntax = /^\*\*[\s\S]+?\*\*/;
const closer = /^\*\*/;

export const strong: StrongParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('**') || source.startsWith('****') || !source.match(syntax)) return;
  const [cs, rest] = loop(compose<SubParsers, HTMLElement | Text>([inline]), closer)(source.slice(2)) || [[], ''];
  if (!rest.startsWith('**')) return;
  const el = document.createElement('strong');
  void el.appendChild(squash(cs));
  return [[el], rest.slice(2)];
}
