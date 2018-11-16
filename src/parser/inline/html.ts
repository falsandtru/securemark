import { HTMLParser, inline } from '../inline';
import { inits, sequence, some, fmap, match, surround, subline, verify, focus } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { compress, hasText } from '../util';
import { html as htm, text, frag } from 'typed-dom';

const tags = new Set('ins|del|sup|sub|small|bdi|bdo|wbr'.split('|'));
assert([...tags].every(tag => /^[a-z]+$/.test(tag)));
assert([...tags].every(tag => !['script', 'style', 'link', 'a', 'img'].includes(tag)));
assert([...tags].every(tag => !['strong', 'em', 'code', 's', 'u', 'mark'].includes(tag)));
const emptytags = new Set('wbr'.split('|'));
assert([...emptytags].every(tag => tags.has(tag)));

export const html: HTMLParser = match(
  /^(?=<([a-z]+)(?: [^\n>]*)?>)/,
  ([, tag], source) => {
    if (!tags.has(tag)) return;
    if (emptytags.has(tag)) return [[htm(tag as 'wbr')], source.slice(tag.length + 2)];
    assert(tags.has(tag));
    return verify(
      fmap(
        sequence<HTMLParser>([
          fmap(
            surround(`<${tag}`, some(compress(attribute)), /^ ?>/, false),
            ts => [frag(ts)]),
          surround(``, compress(some(inline, `</${tag}>`)), `</${tag}>`),
        ]),
        ([attrs, ...contents]) =>
          [elem(tag as 'span', [...attrs.childNodes].map(t => t.textContent!), contents)]),
      ([el]) => hasText(el))
      (source);
  });

const attribute: HTMLParser.AttributeParser = subline(fmap(
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
      : [key, text('='), value]));

const attributes: Partial<Record<keyof HTMLElementTagNameMap, Record<string, ReadonlyArray<string | undefined>> | undefined>> = {
  bdo: {
    dir: Object.freeze(['ltr', 'rtl']),
  },
};

function elem(tag: keyof HTMLElementTagNameMap, args: string[], children: Node[]): HTMLElement {
  const el = htm(tag, children);
  const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
    arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
  if (!attributes[tag] && args.length > 0 || attrs.size !== args.length) {
    void el.classList.add('invalid');
  }
  if (attributes[tag]) {
    if (attrs.size < [...Object.values(attributes[tag]!)].filter(Object.isFrozen).length) {
      void el.classList.add('invalid');
    }
    for (const [key, value] of attrs.entries()) {
      attributes[tag]!.hasOwnProperty(key) && attributes[tag]![key].includes(value)
        ? void el.setAttribute(key, value || '')
        : void el.classList.add('invalid');
    }
  }
  if (el.matches('.invalid')) {
    void el.setAttribute('data-invalid-type', 'parameter');
  }
  return el;
}
