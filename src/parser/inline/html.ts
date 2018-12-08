import { HTMLParser, inline } from '../inline';
import { SubParsers } from '../../combinator/data/parser';
import { union, inits, sequence, some, fmap, bind, match, surround, subline, verify, focus } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { defrag, hasText, wrap } from '../util';
import { html as htm, text } from 'typed-dom';

const tags = new Set('ins|del|sup|sub|small|bdi|bdo'.split('|'));
assert([...tags].every(tag => /^[a-z]+$/.test(tag)));
assert([...tags].every(tag => !['script', 'style', 'link', 'a', 'img'].includes(tag)));
assert([...tags].every(tag => !['strong', 'em', 'code', 's', 'u', 'mark'].includes(tag)));
const emptytags = new Set('wbr'.split('|'));
assert([...emptytags].every(tag => !tags.has(tag)));

export const html: HTMLParser = union([
  match(
    /^(?=<([a-z]+)(?: [^\n>]*)?>)/,
    ([, tag], source) => {
      if (!tags.has(tag)) return;
      return verify(
        fmap(
          sequence<SubParsers<HTMLParser>[0]>([
            wrap(surround(`<${tag}`, some(defrag(attribute)), /^ ?>/, false)),
            surround(``, defrag(some(inline, `</${tag}>`)), `</${tag}>`),
          ]),
          ([attrs, ...contents]) =>
            [elem(tag as 'span', [...attrs.childNodes].map(t => t.textContent!), contents)]),
        ([el]) => el.matches(':not(.invalid)') && hasText(el))
        (source);
    }),
  match(
    /^(?=<([a-z]+)(?: [^\n>]*)?>)/,
    ([, tag], source) => {
      if (!emptytags.has(tag)) return;
      return verify(
        fmap(
          sequence<SubParsers<HTMLParser>[1]>([
            wrap(surround(`<${tag}`, some(defrag(attribute)), /^ ?>/, false)),
          ]),
          ([attrs]) =>
            [elem(tag as 'span', [...attrs.childNodes].map(t => t.textContent!), [])]),
        ([el]) => el.matches(':not(.invalid)'))
        (source);
    }),
  match(
    /^(?=<([a-z]+)(?: [^\n>]*)?>)/,
    ([, tag], source) =>
      bind(
        sequence<SubParsers<HTMLParser>[2]>([
          surround(`<${tag}`, some(defrag(attribute)), /^ ?\/?>/, false),
        ]),
        (_, rest) =>
          [[htm('span', { class: 'invalid', 'data-invalid-type': 'html' }, source.slice(0, source.length - rest.length))], rest])
        (source)),
]);

const attribute: HTMLParser.AttributeParser = subline(fmap(
  surround(
    ' ',
    inits([
      focus(/^[a-z]+(?=[= >])/, defrag(some(unescsource, /^[^a-z]/))),
      surround('="', defrag(some(escsource, '"')), '"', false)
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
