import { HTMLParser } from '../inline';
import { Recursion } from '../context';
import { union, subsequence, some, recursion, precedence, validate, focus, surround, open, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { isLooseNodeStart, blankWith } from '../visibility';
import { memoize } from 'spica/memoize';
import { Clock } from 'spica/clock';
import { unshift, push, splice } from 'spica/array';
import { html as h, defrag } from 'typed-dom/dom';

const tags = Object.freeze(['bdo', 'bdi']);
const attrspecs = {
  bdo: {
    dir: Object.freeze(['ltr', 'rtl']),
  },
} as const;
Object.setPrototypeOf(attrspecs, null);
Object.values(attrspecs).forEach(o => Object.setPrototypeOf(o, null));

export const html: HTMLParser = lazy(() => validate(/^<[a-z]+(?=[^\S\n]|>)/i,
  union([
    focus(
      /^<wbr[^\S\n]*>/i,
      () => [[h('wbr')], '']),
    surround(
      // https://html.spec.whatwg.org/multipage/syntax.html#void-elements
      str(/^<(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)(?=[^\S\n]|>)/i),
      some(union([attribute])),
      str(/^[^\S\n]*>/), true,
      ([as, bs = [], cs], rest) =>
        [[elem(as[0].slice(1), push(unshift(as, bs), cs), [], [])], rest]),
    match(
      new RegExp(String.raw`^<(${TAGS.join('|')})(?=[^\S\n]|>)`),
      memoize(
      ([, tag]) =>
        surround<HTMLParser.TagParser, string>(
          surround(str(`<${tag}`), some(attribute), str(/^[^\S\n]*>/), true),
          precedence(3, recursion(Recursion.inline,
          subsequence([
            focus(/^[^\S\n]*\n/, some(inline)),
            some(open(/^\n?/, some(inline, blankWith('\n', `</${tag}>`), [[blankWith('\n', `</${tag}>`), 3]]), true)),
          ]))),
          str(`</${tag}>`), true,
          ([as, bs = [], cs], rest) =>
            [[elem(tag, as, bs, cs)], rest],
          ([as, bs = []], rest) =>
            [[elem(tag, as, bs, [])], rest]),
      ([, tag]) => tag,
      new Map())),
    match(
      /^<([a-z]+)(?=[^\S\n]|>)/i,
      memoize(
      ([, tag]) =>
        surround<HTMLParser.TagParser, string>(surround(
          str(`<${tag}`), some(attribute), str(/^[^\S\n]*>/), true),
          precedence(3, recursion(Recursion.inline,
          subsequence([
            focus(/^[^\S\n]*\n/, some(inline)),
            some(inline, `</${tag}>`, [[`</${tag}>`, 3]]),
          ]))),
          str(`</${tag}>`), true,
          ([as, bs = [], cs], rest) =>
            [[elem(tag, as, bs, cs)], rest],
          ([as, bs = []], rest) =>
            [[elem(tag, as, bs, [])], rest]),
      ([, tag]) => tag,
      new Clock(10000))),
  ])));

export const attribute: HTMLParser.AttributeParser = union([
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="[^"\n]*")?(?=[^\S\n]|>)/i),
]);

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// [...document.querySelectorAll('tbody > tr > td:first-child')].map(el => el.textContent.slice(1, -1))
const TAGS = Object.freeze([
  "html",
  "base",
  "head",
  "link",
  "meta",
  "style",
  "title",
  "body",
  "address",
  "article",
  "aside",
  "footer",
  "header",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "hgroup",
  "main",
  "nav",
  "section",
  "blockquote",
  "dd",
  "div",
  "dl",
  "dt",
  "figcaption",
  "figure",
  "hr",
  "li",
  "menu",
  "ol",
  "p",
  "pre",
  "ul",
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "br",
  "cite",
  "code",
  "data",
  "dfn",
  "em",
  "i",
  "kbd",
  "mark",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
  "area",
  "audio",
  "img",
  "map",
  "track",
  "video",
  "embed",
  "iframe",
  "object",
  "picture",
  "portal",
  "source",
  "svg",
  "math",
  "canvas",
  "noscript",
  "script",
  "del",
  "ins",
  "caption",
  "col",
  "colgroup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "button",
  "datalist",
  "fieldset",
  "form",
  "input",
  "label",
  "legend",
  "meter",
  "optgroup",
  "option",
  "output",
  "progress",
  "select",
  "textarea",
  "details",
  "dialog",
  "summary",
  "slot",
  "template",
  "acronym",
  "applet",
  "bgsound",
  "big",
  "blink",
  "center",
  "content",
  "dir",
  "font",
  "frame",
  "frameset",
  "image",
  "keygen",
  "marquee",
  "menuitem",
  "nobr",
  "noembed",
  "noframes",
  "param",
  "plaintext",
  "rb",
  "rtc",
  "shadow",
  "spacer",
  "strike",
  "tt",
  "xmp",
]);

function elem(tag: string, as: string[], bs: (HTMLElement | string)[], cs: string[]): HTMLElement {
  assert(as.length > 0);
  assert(as[0][0] === '<' && as.at(-1)!.slice(-1) === '>');
  if (!tags.includes(tag)) return invalid('tag', `Invalid HTML tag name "${tag}"`, as, bs, cs);
  if (cs.length === 0) return invalid('tag', `Missing the closing HTML tag "</${tag}>"`, as, bs, cs);
  if (bs.length === 0) return invalid('content', `Missing the content`, as, bs, cs);
  if (!isLooseNodeStart(bs)) return invalid('content', `Missing the visible content in the same line`, as, bs, cs);
  const attrs = attributes('html', [], attrspecs[tag], as.slice(1, -1));
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
    if (spec && name in spec && !spec[name]) continue;
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
