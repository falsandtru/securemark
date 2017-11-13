import { HTMLParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^<([a-z]+)>/;
const inlinetags = Object.freeze('ins|del|sup|sub|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert(inlinetags.every(t => /[a-z]+/.test(t)));
assert(inlinetags.every(t => ['script', 'style', 'link', 'a', 'img'].indexOf(t) === -1));
assert(inlinetags.every(t => ['strong', 'em', 'code', 's', 'u'].indexOf(t) === -1));

export const html: HTMLParser = function (source: string) {
  if (!validate(source, '<')) return;
  const [opentag, tagname] = source.match(syntax) || ['', '', ''];
  if (!opentag) return;
  if (inlinetags.indexOf(tagname) === -1) return;
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
    (source)
};
