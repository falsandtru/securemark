import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { HTMLParser, InlineParser, inline } from '../inline';
import { UnescapableSourceParser } from '../source';
import { unescsource } from '../source/unescapable';
import { squash } from '../squash';

type SubParsers = [InlineParser] | [UnescapableSourceParser];

const syntax = /^(<([a-z]+)>)/;
const inlinetags = Object.freeze('code|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert(inlinetags.every(t => /[a-z]+/.test(t)));
assert(inlinetags.every(t => ['script', 'style', 'link', 'a', 'img'].indexOf(t) === -1));
assert(inlinetags.every(t => ['ins', 'del', 'strong', 'em', 'sup', 'sub', 's', 'u'].indexOf(t) === -1));

export const html: HTMLParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('<')) return;
  const [whole, opentag, tagname] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  if (inlinetags.indexOf(tagname) === -1) return;
  if (tagname === 'wbr') return [[document.createElement(tagname)], source.slice(opentag.length)];
  const [cs, rest] = tagname === 'code'
    ? loop(combine<SubParsers, HTMLElement | Text>([unescsource]), `^</${tagname}>`)(source.slice(opentag.length)) || [[], source.slice(opentag.length)]
    : loop(combine<SubParsers, HTMLElement | Text>([inline]), `^</${tagname}>`)(source.slice(opentag.length)) || [[], source.slice(opentag.length)];
  const el = document.createElement(tagname);
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  const closetag = `</${tagname}>`;
  return rest.slice(0, closetag.length) === closetag
    ? [[el], rest.slice(closetag.length)]
    : void 0;
};
