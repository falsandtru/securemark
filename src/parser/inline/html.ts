import { Result } from '../../parser';
import { HTMLParser, InlineParser, PlainTextParser, inline, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { plaintext } from './plaintext';

type SubParsers = [InlineParser] | [PlainTextParser];

const syntax = /^(<([a-z]+)>)/i;
const inlinetags = Object.freeze('code|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert(inlinetags.every(t => /[a-z]+/.test(t)));
assert(inlinetags.every(t => ['script', 'style', 'link', 'a', 'img'].indexOf(t) === -1));
assert(inlinetags.every(t => ['ins', 'del', 'strong', 'em', 'sup', 'sub', 's', 'u'].indexOf(t) === -1));
const cache = new Map<string, RegExp>();

export const html: HTMLParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('<')) return;
  const [whole, opentag, tagname] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  if (inlinetags.indexOf(tagname) === -1) return;
  if (tagname === 'wbr') return [[document.createElement(tagname)], source.slice(opentag.length)];
  if (!cache.has(tagname)) {
    void cache.set(tagname, new RegExp(`^</${tagname}>`));
  }
  const [cs, rest] = tagname === 'code'
    ? loop(combine<SubParsers, HTMLElement | Text>([plaintext]), cache.get(tagname)!)(source.slice(opentag.length)) || [[], source.slice(opentag.length)]
    : loop(combine<SubParsers, HTMLElement | Text>([inline]), cache.get(tagname)!)(source.slice(opentag.length)) || [[], source.slice(opentag.length)];
  const el = document.createElement(tagname);
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  const closetag = `</${tagname}>`;
  return rest.slice(0, closetag.length) === closetag
    ? [[el], rest.slice(closetag.length)]
    : void 0;
};
