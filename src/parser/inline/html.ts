import { HTMLParser, inline } from '../inline';
import { union, some, match, surround, transform } from '../../combinator';
import { compress, hasText } from '../util';
import { html as htm } from 'typed-dom';

const syntax = /^<([a-z]+)>/;
const tags = Object.freeze('ins|del|sup|sub|small|cite|mark|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert(tags.every(tag => /[a-z]+/.test(tag)));
assert(tags.every(tag => !['script', 'style', 'link', 'a', 'img'].includes(tag)));
assert(tags.every(tag => !['strong', 'em', 'code', 's', 'u'].includes(tag)));

export const html: HTMLParser = match(syntax, ([whole, tag], source) => {
  if (!tags.includes(tag)) return;
  const opentag = `<${tag}>`;
  assert(whole.startsWith(opentag));
  if (tag === 'wbr') return [[htm(tag)], source.slice(opentag.length)];
  return transform(
    surround<HTMLParser>(`<${tag}>`, compress(some(union([inline]), `</${tag}>`)), `</${tag}>`),
    (ns, rest) => {
      const el = htm(tag as 'wbr', ns);
      return hasText(el)
        ? [[el], rest]
        : undefined;
    })
    (source);
});
