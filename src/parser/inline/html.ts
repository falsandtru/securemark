import { HTMLParser, inline } from '../inline';
import { SubParsers } from '../../combinator/data/parser';
import { union, inits, sequence, some, fmap, bind, match, surround, verify, subline, rewrite, focus } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { char } from '../source/char';
import { defrag, dup, hasText } from '../util';
import { html as htm } from 'typed-dom';

export const html: HTMLParser = union([
  match(
    /^(?=<(ins|del|sup|sub|small|bdi|bdo)(?: [^\n]*?)?>)/,
    ([, tag], source) => {
      return verify(
        fmap(
          sequence<SubParsers<HTMLParser>[0]>([
            dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?>/, false)),
            dup(surround(``, defrag(some(union([inline]), `</${tag}>`)), `</${tag}>`)),
          ]),
          ([attrs, contents]: [Text[], (HTMLElement | Text)[]]) =>
            [elem(tag as 'span', attrs.map(t => t.textContent!), contents)]),
        ([el]) => el.matches(':not(.invalid)') && hasText(el))
        (source);
    }),
  match(
    /^(?=<(wbr)(?: [^\n]*?)?>)/,
    ([, tag], source) => {
      return verify(
        fmap(
          sequence<SubParsers<HTMLParser>[1]>([
            dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?>/, false)),
          ]),
          ([attrs]) =>
            [elem(tag as 'span', attrs.map(t => t.textContent!), [])]),
        ([el]) => el.matches(':not(.invalid)'))
        (source);
    }),
  match(
    /^(?=<([a-z]+)(?: [^\n]*?)?>)/,
    ([, tag], source) =>
      bind(
        sequence<SubParsers<HTMLParser>[2]>([
          dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?\/?>/, false)),
        ]),
        (_, rest) =>
          [[htm('span', { class: 'invalid', 'data-invalid-type': 'html' }, source.slice(0, source.length - rest.length))], rest])
        (source)),
]);

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
