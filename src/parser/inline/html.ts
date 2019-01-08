import { HTMLParser, inline } from '../inline';
import { SubParsers } from '../../combinator/data/parser';
import { union, inits, sequence, some, subline, rewrite, focus, validate, verify, surround, match, lazy, fmap } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { char } from '../source/char';
import { defrag, dup, hasText } from '../util';
import { html as htm } from 'typed-dom';

export const html: HTMLParser = lazy(() => validate(/^<[a-z]+[ >]/, union([
  match(
    /^(?=<(ins|del|sup|sub|small|bdi|bdo)(?: [^\n]*?)?>)/,
    ([, tag]) =>
      verify(fmap(
        sequence<SubParsers<HTMLParser>[0]>([
          dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?>/, false)),
          dup(surround(``, defrag(some(union([inline]), `</${tag}>`)), `</${tag}>`)),
        ]),
        ([attrs, contents]: [Text[], (HTMLElement | Text)[]]) =>
          [elem(tag as 'span', attrs.map(t => t.textContent!), contents)]),
        ([el]) => !el.matches('.invalid') && hasText(el))),
  match(
    /^(?=<(wbr)(?: [^\n]*?)?>)/,
    ([, tag]) =>
      verify(fmap(
        sequence<SubParsers<HTMLParser>[1]>([
          dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?>/, false)),
        ]),
        ([attrs]) =>
          [elem(tag as 'span', attrs.map(t => t.textContent!), [])]),
        ([el]) => !el.matches('.invalid'))),
  rewrite(
    sequence<SubParsers<HTMLParser>[2]>([
      dup(surround(/<[a-z]+/, some(defrag(union([attribute]))), /^ ?\/?>/, false)),
    ]),
    source =>
      [[htm('span', { class: 'invalid', 'data-invalid-type': 'html' }, source)], '']),
])));

const attribute: HTMLParser.ParamParser.AttributeParser = subline(verify(
  surround(
    ' ',
    inits([
      defrag(focus(/^[a-z]+(?:-[a-z]+)*/, some(unescsource))),
      char('='),
      defrag(rewrite(
        surround('"', some(escsource, '"'), '"', false),
        some(escsource))),
    ]),
    ''),
  ts => ts.length !== 2));

const attributes: Partial<Record<keyof HTMLElementTagNameMap, Record<string, ReadonlyArray<string | undefined>> | undefined>> = {
  bdo: {
    dir: Object.freeze(['ltr', 'rtl']),
  },
};

function elem(tag: keyof HTMLElementTagNameMap, args: string[], children: Node[]): HTMLElement {
  const el = htm(tag, children);
  const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
    arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 2, -1) : undefined]));
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
