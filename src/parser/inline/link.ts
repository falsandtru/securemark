﻿import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { LinkParser, InlineParser, inline } from '../inline';
import { squash } from '../text';
import { text } from '../text/text';
import { sanitize } from '../text/url';
import { section } from '../text/section';

type SubParsers = [InlineParser];

const syntax = /^\[[^\n]*?\]\n?\(/;

export const link: LinkParser = function (source: string): Result<HTMLAnchorElement, SubParsers> {
  if (!source.startsWith('[') || source.search(syntax) !== 0) return;
  const [[, ...first], next] = loop(combine<SubParsers, HTMLElement | Text>([inline]), /^\]\n?\(|^\n/)(` ${source.slice(1)}`) || [[], ''];
  if (!next.startsWith('](') && !next.startsWith(']\n(')) return;
  const children = squash(first);
  if (children.querySelector('a, .annotation')) return;
  if (children.querySelector('img')) {
    if (children.childNodes.length > 1) return;
  }
  else {
    if (children.childNodes.length > 0 && children.textContent!.trim() === '') return;
    if (children.textContent !== children.textContent!.trim()) return;
  }
  const [[, ...second], rest] = loop(text, /^\)|^\s(?!nofollow|section)/)(`?${next.replace(/^\]\n?\(/, '')}`) || [[], ''];
  if (!rest.startsWith(')')) return;
  const [INSECURE_URL, attribute] = second.reduce((s, c) => s + c.textContent, '').split(/\s/);
  assert(attribute === void 0 || attribute === 'nofollow' || attribute === 'section');
  const url = sanitize(INSECURE_URL);
  assert(url === url.trim());
  if (INSECURE_URL !== '' && url === '') return;
  const el = document.createElement('a');
  void el.setAttribute('href', attribute === 'section' ? url.replace(/#\S+/, hash => `#${section(hash.slice(1))}`) : url);
  void el.setAttribute('rel', attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener');
  if (location.protocol !== el.protocol || location.host !== el.host) {
    void el.setAttribute('target', '_blank');
  }
  if (attribute === 'section' && el.hash.length < 2) return;
  void el.appendChild(
    children.textContent || children.querySelector('img')
      ? children
      : attribute === 'section'
        ? document.createTextNode(INSECURE_URL.slice(1))
        : document.createTextNode((INSECURE_URL || el.href).replace(/^h(?=ttps?:\/\/)/, attribute === 'nofollow' ? '' : 'h')));
  assert(el.querySelector('img') || el.textContent!.trim());
  return [[el], rest.slice(1)];
};
