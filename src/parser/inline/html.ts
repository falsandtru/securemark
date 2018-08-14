import { HTMLParser, inline } from '../inline';
import { union, some, fmap, match, surround, verify } from '../../combinator';
import { compress, hasText } from '../util';
import { html as htm } from 'typed-dom';

const tags = new Set('ins|del|sup|sub|small|cite|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert([...tags].every(tag => /^[a-z]+$/.test(tag)));
assert([...tags].every(tag => !['script', 'style', 'link', 'a', 'img'].includes(tag)));
assert([...tags].every(tag => !['strong', 'em', 'code', 's', 'u', 'mark'].includes(tag)));

export const html: HTMLParser = match(
  /^(?=<([a-z]+)>)/,
  ([, tag], source) => {
    if (!tags.has(tag)) return;
    if (['wbr'].includes(tag)) return [[htm(tag as 'wbr')], source.slice(tag.length + 2)];
    assert(tags.has(tag));
    return verify(fmap<HTMLParser>(
      surround(`<${tag}>`, compress(some(union([inline]), `</${tag}>`)), `</${tag}>`),
      ns => [htm(tag as 'span', ns)]
    ), ([el]) => hasText(el))
      (source);
  });
