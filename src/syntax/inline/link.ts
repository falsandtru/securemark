import { Result } from '../../parser.d';
import { LinkParser, ImageParser, TextParser } from '../inline';
import { compose } from '../../parser/compose';
import { loop } from '../../parser/loop';
import { image } from './image';
import { text, squash } from './text';
import { sanitize } from '../string/url';

type SubParsers = [ImageParser] | [TextParser];

const syntax = /^\[[^\n]*?\]\(/;

export const link: LinkParser = function (source: string): Result<HTMLAnchorElement, SubParsers> {
  if (!source.startsWith('[') || source.startsWith('[[') || !source.match(syntax)) return;
  const [first, next] = source.startsWith('[]')
    ? [[], source.slice(1)]
    : compose<SubParsers, HTMLElement | Text>([image])(source.slice(1)) || loop(compose<SubParsers, HTMLElement | Text>([text]), /^\]|^\n/)(source.slice(1)) || [[], ''];
  if (!next.startsWith('](')) return;
  const children = squash(first);
  const [[, , ...second], rest] = loop(text, /^\)|^\n/)(next) || [[], ''];
  if (!rest.startsWith(')')) return;
  const url = sanitize(second.reduce((s, c) => s + c.textContent, ''));
  if (url === '') return;
  const el = document.createElement('a');
  void el.setAttribute('href', url);
  if (location.protocol !== el.protocol || location.host !== el.host) {
    void el.setAttribute('target', '_blank');
  }
  void el.appendChild(children.querySelector('img') || document.createTextNode((children.textContent || url).trim()));
  return [[el], rest.slice(1)];
}
