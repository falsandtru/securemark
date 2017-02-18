import { Result } from '../../parser.d';
import { HTMLParser, InlineParser, PlainTextParser, inline } from '../inline';
import { compose } from '../../parser/compose';
import { loop } from '../../parser/loop';
import { plaintext } from './plaintext';
import { squash } from './text';

type SubParsers = [InlineParser] | [PlainTextParser];

const syntax = /^(<([a-z]+)>)/i;
const inlinetags = Object.freeze('small|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|u|mark|ruby|rt|rp|bdi|bdo|ins|del'.split('|'));
assert(inlinetags.every(t => /[a-z]+/.test(t)));
assert(inlinetags.every(t => ['script', 'style', 'link', 'a', 'img'].indexOf(t) === -1));
assert(inlinetags.every(t => ['s', 'em', 'strong'].indexOf(t) === -1));
const cache = new Map<string, RegExp>();

export const html: HTMLParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('<') || source.startsWith('<<')) return;
  const [whole, opentag, tagname] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  if (inlinetags.indexOf(tagname.toLowerCase()) === -1) return;
  if (!cache.has(tagname)) {
    void cache.set(tagname, new RegExp(`^</${tagname}>`, 'i'));
  }
  const [cs, rest] = tagname.toLowerCase() === 'code'
    ? loop(compose<SubParsers, HTMLElement | Text>([plaintext]), cache.get(tagname)!)(source.slice(opentag.length)) || [[], source.slice(opentag.length)]
    : loop(compose<SubParsers, HTMLElement | Text>([inline]), cache.get(tagname)!)(source.slice(opentag.length)) || [[], source.slice(opentag.length)];
  const el = document.createElement(tagname);
  void el.appendChild(squash(cs));
  const closetag = `</${tagname}>`;
  const closed = rest.slice(0, closetag.length).toLowerCase() === closetag.toLowerCase();
  return [[el], rest.slice(closed ? closetag.length : 0)];
};
