import { undefined, Object } from 'spica/global';
import { HTMLParser } from '../inline';
import { union, some, validate, creator, surround, open, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { startLoose, blankWith } from '../util';
import { html as h, defrag } from 'typed-dom/dom';
import { memoize } from 'spica/memoize';
import { Cache } from 'spica/cache';
import { unshift, push, splice } from 'spica/array';

const tags = Object.freeze(['wbr', 'sup', 'sub', 'small', 'bdo', 'bdi']);
const attrspec = {
  bdo: {
    dir: Object.freeze(['ltr', 'rtl'] as const),
  },
} as const;
Object.setPrototypeOf(attrspec, null);
Object.values(attrspec).forEach(o => Object.setPrototypeOf(o, null));

export const html: HTMLParser = lazy(() => creator(validate('<', validate(/^<[a-z]+(?=[^\S\n]|>)/, union([
  match(
    /^<(wbr)(?=[^\S\n]|>)/,
    memoize(
    ([, tag]) =>
      surround(
        `<${tag}`, some(union([attribute])), /^\s*>/, true,
        ([, bs = []], rest) =>
          [[h(tag as 'span', attributes('html', [], attrspec[tag], bs))], rest]),
    ([, tag]) => tags.indexOf(tag), [])),
  match(
    /^<(sup|sub|small|bdo|bdi)(?=[^\S\n]|>)/,
    memoize(
    ([, tag]) =>
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str(/^\s*>/), true),
        startLoose(some(union([
          open(/^\n?/, some(inline, blankWith('\n', `</${tag}>`)), true),
        ])), `</${tag}>`),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest) =>
          [[elem(tag, as, bs, cs)], rest]),
    ([, tag]) => tags.indexOf(tag), [])),
  match(
    /^<([a-z]+)(?=[^\S\n]|>)/,
    memoize(
    ([, tag]) =>
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str(/^\s*>/), true),
        startLoose(some(union([
          open(/^\n?/, some(inline, blankWith('\n', `</${tag}>`)), true),
        ])), `</${tag}>`),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest) =>
          [[elem(tag, as, bs, cs)], rest]),
    ([, tag]) => tag,
    new Cache(10000))),
])))));

export const attribute: HTMLParser.TagParser.AttributeParser = union([
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|>)/),
]);

function elem(tag: string, as: string[], bs: (HTMLElement | string)[], cs: string[]): HTMLElement {
  assert(as.length > 0);
  assert(as[0][0] === '<' && as[as.length - 1].slice(-1) === '>');
  assert(cs.length === 1);
  if (!tags.includes(tag)) return invalid('tag', `Invalid HTML tag <${tag}>`, as, bs, cs);
  const attrs = attributes('html', [], attrspec[tag], as.slice(1, -1));
  return 'data-invalid-syntax' in attrs
    ? invalid('attribute', 'Invalid HTML attribute', as, bs, cs)
    : h(tag as 'span', attrs, defrag(bs));
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
    Object.entries(spec).flatMap(([k, v]) => v && Object.isFrozen(v) ? [k] : []),
  new WeakMap());

export function attributes(
  syntax: string,
  classes: readonly string[],
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
    attrs['class'] = (classes.includes('invalid') ? classes : unshift(classes, ['invalid'])).join(' ');
    attrs['data-invalid-syntax'] = syntax;
    attrs['data-invalid-type'] = 'argument';
    attrs['data-invalid-message'] = 'Invalid argument';
  }
  return attrs;
}
