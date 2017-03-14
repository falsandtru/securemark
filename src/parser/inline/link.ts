import { Result } from '../../parser';
import { LinkParser, InlineParser, inline, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { text } from './text';
import { sanitize } from '../string/url';

type SubParsers = [InlineParser];

const syntax = /^\[[^\n]*?\]\(/;

export const link: LinkParser = function (source: string): Result<HTMLAnchorElement, SubParsers> {
  if (!source.startsWith('[') || !source.match(syntax)) return;
  const [first, next] = source.startsWith('[]')
    ? [[], source.slice(1)]
    : loop(combine<SubParsers, HTMLElement | Text>([inline]), /^\]\(|^\n/)(source.slice(1)) || [[], ''];
  if (!next.startsWith('](')) return;
  const children = squash(first);
  if (children.querySelector('a, .annotation')) return;
  if (children.querySelector('img')) {
    if (children.childNodes.length > 1) return;
  }
  else {
    if (children.childNodes.length > 0 && children.textContent!.trim() === '') return;
    if (children.textContent !== children.textContent!.trim()) return;
  }
  const [[, , ...second], rest] = loop(text, /^\)|^\s(?!nofollow)/)(next) || [[], ''];
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
  void el.appendChild(children.textContent || children.querySelector('img') ? children : document.createTextNode(url.trim()));
  return [[el], rest.slice(1)];
};
