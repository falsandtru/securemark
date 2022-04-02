import { undefined } from 'spica/global';
import { isFrozen, ObjectEntries, ObjectFreeze, ObjectSetPrototypeOf, ObjectValues } from 'spica/alias';
import { MarkdownParser } from '../../../markdown';
import { HTMLParser } from '../inline';
import { union, some, validate, context, creator, surround, open, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startLoose, blank } from '../util';
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

export const html: HTMLParser = lazy(() => creator(validate('<', validate(/^<[a-z]+(?=[^\S\n]|>)/, union([
  match(
    /^(?=<(wbr)(?=[^\S\n]|>))/,
    memoize(
    ([, tag]) =>
      surround(
        `<${tag}`, some(union([attribute])), /^\s*>/, true,
        ([, bs = []], rest) =>
          [[h(tag as 'span', attributes('html', [], attrspec[tag], bs))], rest]),
    ([, tag]) => tag)),
  match(
    /^(?=<(sup|sub|small)(?=[^\S\n]|>))/,
    memoize(
    ([, tag]) =>
      validate(`<${tag}`, `</${tag}>`,
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str(/^\s*>/), true),
        startLoose(
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
              assert(false);
              return {};
          }
        })(),
        some(union([
          some(inline, blank(/\n?/, `</${tag}>`)),
          open(/^\n?/, some(inline, '</'), true),
        ]), `</${tag}>`)), `</${tag}>`),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest, context) =>
          [[elem(tag, as, defrag(bs), cs, context)], rest])),
      ([, tag]) => tag)),
  match(
    /^(?=<(bdo|bdi)(?=[^\S\n]|>))/,
    memoize(
    ([, tag]) =>
      validate(`<${tag}`, `</${tag}>`,
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str(/^\s*>/), true),
        startLoose(some(union([
          some(inline, blank(/\n?/, `</${tag}>`)),
          open(/^\n?/, some(inline, '</'), true),
        ]), `</${tag}>`), `</${tag}>`),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest) =>
          [[elem(tag, as, defrag(bs), cs, {})], rest],
        ([as, bs], rest) =>
          as.length === 1 ? [unshift(as, bs), rest] : undefined)),
    ([, tag]) => tag)),
  match(
    /^(?=<([a-z]+)(?=[^\S\n]|>))/,
    memoize(
    ([, tag]) =>
      validate(`<${tag}`, `</${tag}>`,
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str(/^\s*>/), true),
        startLoose(some(union([
          some(inline, blank(/\n?/, `</${tag}>`)),
          open(/^\n?/, some(inline, '</'), true),
        ]), `</${tag}>`), `</${tag}>`),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest) =>
          [[elem(tag, as, defrag(bs), cs, {})], rest],
        ([as, bs], rest) =>
          as.length === 1 ? [unshift(as, bs), rest] : undefined)),
    ([, tag]) => tag,
    new Cache(1000))),
])))));

export const attribute: HTMLParser.TagParser.AttributeParser = union([
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|>)/),
]);

function elem(tag: string, as: string[], bs: (HTMLElement | string)[], cs: string[], context: MarkdownParser.Context): HTMLElement {
  assert(as.length > 0);
  assert(as[0][0] === '<' && as[as.length - 1].slice(-1) === '>');
  assert(bs.length === defrag(bs).length);
  assert(cs.length === 1);
  if (!tags.includes(tag)) return invalid('tag', `Invalid HTML tag <${tag}>.`, as, bs, cs);
  switch (tag) {
    case 'sup':
    case 'sub':
      switch (true) {
        case context.state?.in?.supsub:
          return invalid('nest', `<${tag}> HTML tag cannot be used in <sup> or <sub> HTML tag.`, as, bs, cs);
      }
      break;
    case 'small':
      switch (true) {
        case context.state?.in?.supsub:
        case context.state?.in?.small:
          return invalid('nest', `<${tag}> HTML tag cannot be used in <sup>, <sub>, or <small> HTML tag.`, as, bs, cs);
      }
      break;
  }
  let attrs: Record<string, string | undefined> | undefined;
  switch (true) {
    case 'data-invalid-syntax' in (attrs = attributes('html', [], attrspec[tag], as.slice(1, -1) as string[])):
      return invalid('attribute', 'Invalid HTML attribute.', as, bs, cs);
    default:
      assert(attrs);
      return h(tag as 'span', attrs, bs);
  }
}
function invalid(type: string, message: string, as: (HTMLElement | string)[], bs: (HTMLElement | string)[], cs: (HTMLElement | string)[]): HTMLElement {
  return h('span', {
    class: 'invalid',
    'data-invalid-syntax': 'html',
    'data-invalid-type': type,
    'data-invalid-message': message,
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
  const attrs: Record<string, string | undefined> = {};
  for (let i = 0; i < params.length; ++i) {
    const param = params[i].trim();
    const name = param.split('=', 1)[0];
    const value = param !== name
      ? param.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1')
      : undefined;
    invalid ||= !spec || name in attrs;
    if (spec && !spec[name] && name in spec) continue;
    spec?.[name]?.includes(value) || value !== undefined && spec?.[name]?.length === 0
      ? attrs[name] = value ?? ''
      : invalid ||= !!spec;
    assert(!(name in {} && attrs.hasOwnProperty(name)));
    splice(params, i--, 1);
  }
  invalid ||= !!spec && !requiredAttributes(spec).every(name => name in attrs);
  if (invalid) {
    !classes.includes('invalid') && classes.push('invalid');
    attrs['class'] = join(classes, ' ');
    attrs['data-invalid-syntax'] = syntax;
    attrs['data-invalid-type'] = 'argument';
    attrs['data-invalid-message'] = 'Invalid argument.';
  }
  return attrs;
}
