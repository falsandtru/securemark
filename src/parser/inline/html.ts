import { HTMLParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { match, isVisible } from '../source/validation';
import { html as htm } from 'typed-dom';

const syntax = /^<([a-z]+)>/;
const inlinetags = Object.freeze('ins|del|sup|sub|small|q|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert(inlinetags.every(tag => /[a-z]+/.test(tag)));
assert(inlinetags.every(tag => !['script', 'style', 'link', 'a', 'img'].includes(tag)));
assert(inlinetags.every(tag => !['strong', 'em', 'code', 's', 'u'].includes(tag)));

export const html: HTMLParser = source => {
  if (!match(source, '<')) return;
  const [whole = '', tagname = ''] = source.match(syntax) || [];
  if (!whole) return;
  if (!inlinetags.includes(tagname)) return;
  const opentag = `<${tagname}>`;
  assert(whole.startsWith(opentag));
  if (tagname === 'wbr') return [[htm(tagname)], source.slice(opentag.length)];
  return transform(
    bracket(
      `<${tagname}>`,
      loop(combine<HTMLParser>([inline]), `^</${tagname}>`),
      `</${tagname}>`),
    (ns, rest) => {
      const el = htm(tagname as 'wbr', ns);
      if (!isVisible(el.textContent!)) return;
      return [[el], rest];
    })
    (source);
};
