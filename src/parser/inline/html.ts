import { undefined } from 'spica/global';
import { isFrozen, ObjectCreate, ObjectEntries, ObjectFreeze, ObjectSetPrototypeOf, ObjectValues } from 'spica/alias';
import { MarkdownParser } from '../../../markdown';
import { HTMLParser } from '../inline';
import { union, some, validate, verify, context, creator, surround, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startTight, isEndTight, trimEndBR } from '../util';
import { html as h, defrag } from 'typed-dom';
import { memoize } from 'spica/memoize';
import { Cache } from 'spica/cache';
import { unshift, push, splice, join } from 'spica/array';

const tags = ObjectFreeze(['sup', 'sub', 'small', 'bdo', 'bdi']);
const attrspec = {
  bdo: {
    dir: ObjectFreeze(['ltr', 'rtl'] as const),
  },
} as const;
ObjectSetPrototypeOf(attrspec, null);
ObjectValues(attrspec).forEach(o => ObjectSetPrototypeOf(o, null));

export const html: HTMLParser = lazy(() => creator(validate('<', '>', '\n', validate(/^<[a-z]+[ >]/, union([
  match(
    /^(?=<(wbr)(?=[ >]))/,
    memoize(
    ([, tag]) =>
      surround(
        str(`<${tag}`), some(union([attribute])), str('>'), true,
        ([, as = []], rest) => [
          [h(tag as 'span', attributes('html', [], attrspec[tag], as))],
          rest
        ]),
    ([, tag]) => tag)),
  match(
    /^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/,
    memoize(
    ([, tag]) =>
      validate(`<${tag}`, `</${tag}>`,
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str('>'), true),
        startTight(verify(
        context((() => {
          switch (tag) {
            case 'sup':
            case 'sub':
              return {
                state: { in: { supsub: true } },
                syntax: { inline: {
                  annotation: false,
                  reference: false,
                  media: false,
                }},
              };
            case 'small':
              return {
                state: { in: { small: true } },
                syntax: { inline: {
                  media: false,
                }},
              };
            default:
              return {};
          }
        })(),
        some(union([inline]), `</${tag}>`)),
        isEndTight)),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest, context) =>
          [[elem(tag, as, trimEndBR(bs), cs, context)], rest])),
      ([, tag]) => tag)),
  match(
    /^(?=<([a-z]+)(?=[ >]))/,
    memoize(
    ([, tag]) =>
      validate(`<${tag}`, `</${tag}>`,
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str('>'), true),
        startTight(some(union([inline]), `</${tag}>`)),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest) =>
          isEndTight(bs)
            ? [[elem(tag, as, trimEndBR(bs), cs, {})], rest]
            : as.length === 1
              ? [push(unshift(as, bs), cs), rest]
              : undefined,
        ([as, bs], rest) =>
          as.length === 1
            ? [unshift(as, bs), rest]
            : undefined)),
      new Cache(9))),
])))));

export const attribute: HTMLParser.TagParser.AttributeParser = union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/),
]);

function elem(tag: string, as: (HTMLElement | string)[], bs: (HTMLElement | string)[], cs: (HTMLElement | string)[], context: MarkdownParser.Context): HTMLElement {
  if (!tags.includes(tag)) return invalid('tag', `Invalid HTML tag <${tag}>.`, as, bs, cs);
  switch (tag) {
    case 'sup':
    case 'sub':
      switch (true) {
        case context.state?.in?.supsub:
          return invalid('nest', `<${tag}> HTML tag can't be used in <sup>/<sub> HTML tags.`, as, bs, cs);
      }
      break;
    case 'small':
      switch (true) {
        case context.state?.in?.supsub:
        case context.state?.in?.small:
          return invalid('nest', `<${tag}> HTML tag can't be used in <sup>/<sub>/<small> HTML tags.`, as, bs, cs);
      }
      break;
  }
  let attrs: Record<string, string | undefined> | undefined;
  switch (true) {
    case as[as.length - 1] !== '>'
      || 'data-invalid-syntax' in (attrs = attributes('html', [], attrspec[tag], as.slice(1, -1) as string[])):
      return invalid('attribute', 'Invalid HTML attribute.', as, bs, cs);
    case cs.length === 0:
      return invalid('closer', `Missing the closing HTML tag <${tag}>.`, as, bs, cs);
    default:
      assert(attrs);
      return h(tag as 'span', attrs, defrag(bs));
  }
}
function invalid(type: string, description: string, as: (HTMLElement | string)[], bs: (HTMLElement | string)[], cs: (HTMLElement | string)[]): HTMLElement {
  return h('span', {
    class: 'invalid',
    'data-invalid-syntax': 'html',
    'data-invalid-type': type,
    'data-invalid-description': description,
  }, defrag(push(unshift(as, bs), cs)));
}

const requiredAttributes = memoize(
  (spec: Readonly<Record<string, readonly (string | undefined)[] | undefined>>) =>
    ObjectEntries(spec).flatMap(([k, v]) => v && isFrozen(v) ? [k] : []),
  new WeakMap());

export function attributes(
  syntax: string,
  classes: string[],
  spec: Readonly<Record<string, readonly (string | undefined)[] | undefined>> | undefined,
  params: string[],
): Record<string, string | undefined> {
  assert(spec instanceof Object === false);
  assert(!spec?.['__proto__']);
  assert(!spec?.toString);
  let invalid = false;
  const attrs: Record<string, string | undefined> = ObjectCreate(null);
  assert(attrs instanceof Object === false);
  for (let i = 0; i < params.length; ++i) {
    assert(params[i][0] === ' ');
    const param = params[i].slice(1);
    const name = param.split('=', 1)[0];
    assert(name !== '__proto__');
    const value = param !== name
      ? param.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1')
      : undefined;
    invalid ||= !spec || name in attrs;
    if (spec && !spec[name] && name in spec) continue;
    spec?.[name]?.includes(value) || value !== undefined && spec?.[name]?.length === 0
      ? attrs[name] = value
      : invalid ||= !!spec;
    splice(params, i--, 1);
  }
  invalid ||= !!spec && !requiredAttributes(spec).every(name => name in attrs);
  if (invalid) {
    !classes.includes('invalid') && classes.push('invalid');
    attrs['class'] = join(classes, ' ');
    attrs['data-invalid-syntax'] = syntax;
    attrs['data-invalid-type'] = 'argument';
    attrs['data-invalid-description'] = 'Invalid argument.';
  }
  return attrs;
}
