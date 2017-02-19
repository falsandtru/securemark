import { Result } from '../../parser';
import { StrongParser, InlineParser, inline } from '../inline';
import { compose } from '../../combinator/compose';
import { loop } from '../../combinator/loop';
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
