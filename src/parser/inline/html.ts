import { HTMLParser, inline } from '../inline';
import { union, inits, sequence, some, subline, rewrite, focus, validate, verify, surround, match, memoize, lazy, fmap } from '../../combinator';
import { escsource, unescsource, char } from '../source';
import { defrag, dup, hasText } from '../util';
import { DeepImmutable } from 'spica/type';
import { html as htm } from 'typed-dom';

const attributes: DeepImmutable<Record<string, Record<string, Array<string | undefined>> | undefined>> = {
  bdo: {
    dir: Object.freeze(['ltr', 'rtl']),
  },
};

export const html: HTMLParser = lazy(() => validate(/^<[a-z]+[ >]/, union([
  match(
    /^(?=<(sup|sub|small|bdi|bdo)(?: [^\n>]*)?>)/,
    memoize(([, tag]) => tag,
    tag =>
      verify(fmap(
        sequence([
          dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?>/, false)),
          dup(surround(``, defrag(some(union([inline]), `</${tag}>`)), `</${tag}>`)),
        ]),
        ([attrs_, contents]: [Text[], (HTMLElement | Text)[]]) =>
          [htm(tag as 'span', attrs(attributes[tag], attrs_.map(t => t.textContent!), [], 'html'), contents)]),
        ([el]) => !el.classList.contains('invalid') && hasText(el)))),
  match(
    /^(?=<(wbr)(?: [^\n>]*)?>)/,
    memoize(([, tag]) => tag,
    tag =>
      verify(fmap(
        sequence([
          dup(surround(`<${tag}`, some(defrag(union([attribute]))), /^ ?>/, false)),
        ]),
        ([attrs_]) =>
          [htm(tag as 'span', attrs(attributes[tag], attrs_.map(t => t.textContent!), [], 'html'), [])]),
        ([el]) => !el.classList.contains('invalid')))),
  rewrite(
    // Don't use large size keys for memoization to prevent memory leaks.
    match(
      /^(?=<([a-z]+)(?: [^\n>]*)?>)/,
      ([, tag]) =>
      inits([
        surround(`<${tag}`, some(union([attribute])), /^ ?\/?>/, false),
        surround(``, some(union([inline]), `</${tag}>`), `</${tag}>`, false),
      ])),
    (source, state) =>
      [[htm('span', { class: 'invalid', 'data-invalid-syntax': 'html', 'data-invalid-type': 'syntax' }, source)], '', state]),
])));

export const attribute: HTMLParser.ParamParser.AttributeParser = subline(verify(
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

export function attrs(
  spec: DeepImmutable<Record<string, Array<string | undefined>>> | undefined,
  params: string[],
  classes: string[],
  syntax: string,
): Record<string, string | undefined> {
  const result: Record<string, string> = {};
  let invalid = classes.includes('invalid');
  const attrs: Map<string, string | undefined> = new Map(params.map<[string, string | undefined]>(
    arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 2, -1) : undefined]));
  if (spec) {
    for (const [key, value] of attrs) {
      spec.hasOwnProperty(key) && spec[key].includes(value)
        ? result[key] = value || ''
        : invalid = true;
    }
  }
  invalid = invalid || !spec && params.length > 0 || attrs.size !== params.length;
  invalid = invalid || !!spec && !Object.entries(spec).filter(([, v]) => Object.isFrozen(v)).every(([k]) => attrs.has(k));
  if (invalid) {
    void classes.push('invalid');
    result.class = classes.join(' ').trim();
    result['data-invalid-syntax'] = syntax;
    result['data-invalid-type'] = 'parameter';
  }
  return result;
}
