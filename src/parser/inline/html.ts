import { Map, WeakMap } from 'spica/global';
import { hasOwnProperty, isFrozen, ObjectEntries, ObjectFreeze } from 'spica/alias';
import { HTMLParser, inline } from '../inline';
import { union, inits, sequence, some, subline, rewrite, rewrite_, focus, validate, verify, surround, match, memoize, guard, configure, lazy, fmap } from '../../combinator';
import { escsource, unescsource, char } from '../source';
import { defrag, dup, hasText } from '../util';
import { DeepImmutable } from 'spica/type';
import { memoize as memo } from 'spica/memoize';
import { html as htm } from 'typed-dom';

const attributes = {
  bdo: {
    dir: ObjectFreeze(['ltr', 'rtl'] as const),
  },
} as const;

export const html: HTMLParser = lazy(() => validate(/^<[a-z]+[ />]/, union([
  match(
    /^<(sup|sub|small|bdi|bdo)(?=(?: [^\n>]*)?>)/,
    memoize(([, tag]) => tag,
    tag =>
      configure({ state: { nest: [tag] } },
      guard(config => (config.state?.nest?.length || 0) <= 2,
      verify(fmap(
        sequence([
          dup(surround(``, some(defrag(union([attribute]))), /^ ?>/, false)),
          dup(surround(``, defrag(some(union([inline]), `</${tag}>`)), `</${tag}>`)),
        ]),
        ([attrs_, contents]: [Text[], (HTMLElement | Text)[]]) =>
          [htm(tag as 'span', attrs(attributes[tag], attrs_.map(({ data }) => data), [], 'html'), contents)]),
        ([el]) => !el.classList.contains('invalid') && hasText(el)))))),
  match(
    /^<(wbr)(?=(?: [^\n>]*)?>)/,
    memoize(([, tag]) => tag,
    tag =>
      verify(fmap(
        sequence([
          dup(surround(``, some(defrag(union([attribute]))), /^ ?>/, false)),
        ]),
        ([attrs_]) =>
          [htm(tag as 'span', attrs(attributes[tag], attrs_.map(({ data }) => data), [], 'html'))]),
        ([el]) => !el.classList.contains('invalid')))),
  rewrite_(
    fmap(
      union([
        surround(/^<[a-z]+(?=(?: [^\n>]*)?\/>)/, some(union([attribute])), /^ ?\/>/, false),
        match(
          /^<([a-z]+)(?=(?: [^\n>]*)?>)/,
          // Don't memoize this function because this key size is unlimited
          // and it makes a vulnerability of memory leaks.
          ([, tag]) =>
            configure({ state: { nest: [tag] } },
            guard(config => (config.state?.nest?.length || 0) <= 2,
            inits([
              dup(surround(``, some(union([attribute])), /^ ?>/, false)),
              dup(surround(``, some(union([inline]), `</${tag}>`), `</${tag}>`, false)),
            ])))),
      ]),
      () => []),
    source =>
      [[htm('span', { class: 'invalid', 'data-invalid-syntax': 'html', 'data-invalid-message': 'Invalid tag name, attribute, or invisible content' }, source)], '']),
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

const requiredAttributes = memo(
  (spec: DeepImmutable<Record<string, Array<string | undefined>>>) =>
    ObjectEntries(spec).filter(([, v]) => isFrozen(v)),
  new WeakMap());

export function attrs(
  spec: DeepImmutable<Record<string, Array<string | undefined>>> | undefined,
  params: string[],
  classes: string[],
  syntax: string,
): Record<string, string | undefined> {
  const result: Record<string, string> = {};
  let invalid = classes.includes('invalid');
  const attrs: Map<string, string | undefined> = new Map(params.map<[string, string | undefined]>(
    arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 2, -1) : void 0]));
  if (spec) {
    for (const [key, value] of attrs) {
      hasOwnProperty(spec, key) && spec[key].includes(value)
        ? result[key] = value || ''
        : invalid = true;
    }
  }
  invalid = invalid || !spec && params.length > 0 || attrs.size !== params.length;
  invalid = invalid || !!spec && !requiredAttributes(spec).every(([k]) => attrs.has(k));
  if (invalid) {
    void classes.push('invalid');
    result.class = classes.join(' ').trim();
    result['data-invalid-syntax'] = syntax;
    result['data-invalid-message'] = 'Invalid parameter';
  }
  return result;
}
