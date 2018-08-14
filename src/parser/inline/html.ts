import { HTMLParser, inline } from '../inline';
import { union, inits, some, fmap, match, surround, verify, focus } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { compress, hasText } from '../util';
import { html as htm, text, define } from 'typed-dom';

const tags = new Set('ins|del|sup|sub|small|ruby|rt|rp|bdi|bdo|wbr'.split('|'));
assert([...tags].every(tag => /^[a-z]+$/.test(tag)));
assert([...tags].every(tag => !['script', 'style', 'link', 'a', 'img'].includes(tag)));
assert([...tags].every(tag => !['strong', 'em', 'code', 's', 'u', 'mark'].includes(tag)));

export const html: HTMLParser = match(
  /^(?=<([a-z]+)(?: [^\n>]+)?>)/,
  ([, tag], source) => {
    if (!tags.has(tag)) return;
    if (['wbr'].includes(tag)) return [[htm(tag as 'wbr')], source.slice(tag.length + 2)];
    assert(tags.has(tag));
    const [args = [], rest = undefined] = surround(`<${tag}`, some(compress(attribute), '>'), '>', false)(source) || [];
    if (!rest) return;
    const el = htm(tag as 'span');
    return verify(fmap<HTMLParser>(
      surround(``, compress(some(union([inline]), `</${tag}>`)), `</${tag}>`),
      ns => [define(el, attrs(el, tag, args.map(t => t.textContent!)), ns)]
    ), ([el]) => hasText(el))
      (rest);
  });

const attribute: HTMLParser.AttributeParser = fmap<HTMLParser.AttributeParser>(
  surround(
    ' ',
    inits([
      focus(/^[a-z]+(?=[= >])/, compress(some(unescsource, /^[^a-z]/))),
      surround('="', compress(some(escsource, '"')), '"', false)
    ]),
    ''),
  ([key, value = undefined]) =>
    value === undefined
      ? [key]
      : [key, text('='), value]);

const attributes: Partial<Record<keyof HTMLElementTagNameMap, Record<string, Array<string | undefined>> | undefined>> = {
  bdo: {
    dir: ['ltr', 'rtl'],
  },
};

function attrs(el: HTMLElement, tag: string, args: string[]): Record<string, string> {
  const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
    arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
  if (!attributes[tag] && args.length > 0 || attrs.size !== args.length) {
    void el.classList.add('invalid');
  }
  if (attributes[tag]) {
    for (const [key, value] of [...attrs.entries()]) {
      if (attributes[tag]!.hasOwnProperty(key) && attributes[tag]![key].includes(value)) {
        void el.setAttribute(key, value || '');
      }
      else {
        void attrs.delete(key);
        void el.classList.add('invalid');
      }
    }
  }
  return [...attrs.entries()]
    .reduce((obj, [key, value]) => (obj[key] = value, obj), {});
}
