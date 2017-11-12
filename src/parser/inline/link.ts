import { Result, combine, loop, bracket } from '../../combinator';
import { LinkParser, InlineParser, inline } from '../inline';
import { escsource } from '../source/escapable';
import { squash } from '../squash';
import { validate } from '../source/validation';
import { sanitize } from '../string/url';

type SubParsers = [InlineParser];

const syntax = /^\[[^\n]*?\]\n?\(/;

export const link: LinkParser = function (source: string): Result<HTMLAnchorElement, SubParsers> {
  if (!validate(source, '[', syntax)) return;
  const [first, next] = bracket('[', loop(combine<SubParsers, HTMLElement | Text>([inline]), /^\]\n?\(|^\n/), ']')(source) || [[], source];
  if (!next.startsWith('(') && !next.startsWith('\n(')) return;
  const children = squash(first);
  if (children.querySelector('a, .annotation')) return;
  if (children.querySelector('img')) {
    if (children.childNodes.length > 1) return;
  }
  else {
    if (children.childNodes.length > 0 && children.textContent!.trim() === '') return;
    if (children.textContent !== children.textContent!.trim()) return;
  }
  const [second, rest] = bracket('(', loop(escsource, /^\)|^\s(?!nofollow)/), ')')(next.slice(next.indexOf('('))) || [[], source];
  if (rest === source) return;
  const [INSECURE_URL, attribute] = second.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1').split(/\s/);
  assert(attribute === undefined || attribute === 'nofollow');
  const url = sanitize(INSECURE_URL);
  assert(url === url.trim());
  if (INSECURE_URL !== '' && url === '') return;
  const el = document.createElement('a');
  void el.setAttribute('href', url);
  void el.setAttribute('rel', attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener');
  if (location.protocol !== el.protocol || location.host !== el.host) {
    void el.setAttribute('target', '_blank');
  }
  void el.appendChild(
    children.textContent || children.querySelector('img')
      ? children
      : document.createTextNode((INSECURE_URL || el.href).replace(/^h(?=ttps?:\/\/)/, attribute === 'nofollow' ? '' : 'h')));
  assert(el.querySelector('img') || el.textContent!.trim());
  return [[el], rest];
};
