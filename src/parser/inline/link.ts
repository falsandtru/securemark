import { Result } from '../../parser';
import { LinkParser, ImageParser, TextParser } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { image } from './image';
import { text, squash } from './text';
import { sanitize } from '../string/url';

type SubParsers = [ImageParser] | [TextParser];

const syntax = /^\[[^\n]*?\]\(/;

export const link: LinkParser = function (source: string): Result<HTMLAnchorElement, SubParsers> {
  if (!source.startsWith('[') || !source.match(syntax)) return;
  const [first, next] = source.startsWith('[]')
    ? [[], source.slice(1)]
    : combine<SubParsers, HTMLElement | Text>([image])(source.slice(1)) || loop(combine<SubParsers, HTMLElement | Text>([text]), /^\]\(|^\n/)(source.slice(1)) || [[], ''];
  if (!next.startsWith('](')) return;
  const children = squash(first);
  const [[, , ...second], rest] = loop(text, /^\)|^\s(?!nofollow\))/)(next) || [[], ''];
  if (!rest.startsWith(')')) return;
  const [INSECURE_URL, nofollow] = second.reduce((s, c) => s + c.textContent, '').split(/\s/);
  const url = sanitize(INSECURE_URL);
  if (url === '') return;
  assert(nofollow === void 0 || nofollow === 'nofollow');
  const el = document.createElement('a');
  void el.setAttribute('href', url);
  if (location.protocol !== el.protocol || location.host !== el.host) {
    void el.setAttribute('target', '_blank');
  }
  if (nofollow) {
    void el.setAttribute('rel', 'nofollow');
  }
  void el.appendChild(children.querySelector('img') || document.createTextNode((children.textContent || url).trim()));
  return [[el], rest.slice(1)];
};
