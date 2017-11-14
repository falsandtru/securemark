import { HTMLParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^<([a-z]+)>/;
const inlinetags = Object.freeze('ins|del|sup|sub|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert(inlinetags.every(tag => /[a-z]+/.test(tag)));
assert(inlinetags.every(tag => ['script', 'style', 'link', 'a', 'img'].indexOf(tag) === -1));
assert(inlinetags.every(tag => ['strong', 'em', 'code', 's', 'u'].indexOf(tag) === -1));

export const html: HTMLParser = (source: string) => {
  if (!validate(source, '<')) return;
  const [whole, tagname] = source.match(syntax) || ['', ''];
  if (!whole) return;
  if (inlinetags.indexOf(tagname) === -1) return;
  const opentag = `<${tagname}>`;
  assert(whole.startsWith(opentag));
  if (tagname === 'wbr') return [[document.createElement(tagname)], source.slice(opentag.length)];
  return transform(
    bracket(
      `<${tagname}>`,
      loop(combine<HTMLElement | Text, HTMLParser.InnerParsers>([inline]), `^</${tagname}>`),
      `</${tagname}>`),
    (ns, rest) => {
      const el = document.createElement(tagname);
      void el.appendChild(squash(ns));
      if (el.textContent!.trim() === '') return;
      return [[el], rest];
    })
    (source);
};
