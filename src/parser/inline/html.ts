import { HTMLParser } from '../inline';
import { Recursion } from '../context';
import { List, Node, Context } from '../../combinator/data/parser';
import { Flag } from '../node';
import { union, some, recursion, precedence, surround, open, match, lazy } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { isNonblankFirstLine, blankWith } from '../visibility';
import { invalid, unwrap } from '../util';
import { memoize } from 'spica/memoize';
import { html as h, defrag } from 'typed-dom/dom';

const tags: readonly string[] = ['wbr', 'bdo', 'bdi'];
const attrspecs = {
  wbr: {},
  bdo: {
    dir: Object.freeze(['ltr', 'rtl']),
  },
} as const;
Object.setPrototypeOf(attrspecs, null);
Object.values(attrspecs).forEach(o => Object.setPrototypeOf(o, null));

export const html: HTMLParser = lazy(() =>
  union([
    surround(
      // https://html.spec.whatwg.org/multipage/syntax.html#void-elements
      str(/<(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)(?=[ >])/y),
      precedence(9, some(union([attribute]))),
      open(str(/ ?/y), str('>'), true),
      true, [],
      ([as, bs = new List(), cs], context) =>
        new List([new Node(elem(as.head!.value.slice(1), false, [...unwrap(as.import(bs).import(cs))], new List(), new List(), context), as.head!.value === '<wbr' ? Flag.blank : Flag.none)]),
      ([as, bs = new List()], context) =>
        new List([new Node(elem(as.head!.value.slice(1), false, [...unwrap(as.import(bs))], new List(), new List(), context))])),
    match(
      new RegExp(String.raw`<(${TAGS.join('|')})(?=[ >])`, 'y'),
      memoize(
      ([, tag]) =>
        surround<HTMLParser.TagParser, string>(
          surround(
            str(`<${tag}`),
            precedence(9, some(attribute)),
            open(str(/ ?/y), str('>'), true),
            true, [],
            ([as, bs = new List(), cs]) => as.import(bs).import(cs),
            ([as, bs = new List()]) => as.import(bs)),
          // 不可視のHTML構造が可視構造を変化させるべきでない。
          // 可視のHTMLは優先度変更を検討する。
          // このため`<>`記号は将来的に共通構造を変化させる可能性があり
          // 共通構造を変化させない非構造文字列としては依然としてエスケープを要する。
          precedence(0, recursion(Recursion.inline,
          some(union([
            some(inline, blankWith('\n', `</${tag}>`)),
            open('\n', some(inline, `</${tag}>`), true),
          ])))),
          str(`</${tag}>`),
          true, [],
          ([as, bs = new List(), cs], context) =>
            new List([new Node(elem(tag, true, [...unwrap(as)], bs, cs, context))]),
          ([as, bs = new List()], context) =>
            new List([new Node(elem(tag, true, [...unwrap(as)], bs, new List(), context))])),
      ([, tag]) => tag2index(tag),
      Array(TAGS.length))),
    surround(
      // https://html.spec.whatwg.org/multipage/syntax.html#void-elements
      str(/<[a-z]+(?=[ >])/yi),
      precedence(9, some(union([attribute]))),
      open(str(/ ?/y), str('>'), true),
      true, [],
      ([as, bs = new List(), cs], context) =>
        new List([new Node(elem(as.head!.value.slice(1), false, [...unwrap(as.import(bs).import(cs))], new List(), new List(), context))]),
      ([as, bs = new List()], context) =>
        new List([new Node(elem(as.head!.value.slice(1), false, [...unwrap(as.import(bs))], new List(), new List(), context))])),
  ]));

export const attribute: HTMLParser.AttributeParser = union([
  str(/ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[ >])/yi),
  str(/ [^\s<>]+/y),
]);

function elem(tag: string, content: boolean, as: readonly string[], bs: List<Node<HTMLElement | string>>, cs: List<Node<string>>, context: Context): HTMLElement {
  assert(as.length > 0);
  assert(as[0][0] === '<');
  if (!tags.includes(tag)) return ielem('tag', `Invalid HTML tag name "${tag}"`, context);
  if (content) {
    if (cs.length === 0) return ielem('tag', `Missing the closing HTML tag "</${tag}>"`, context);
    if (bs.length === 0) return ielem('content', `Missing the content`, context);
    if (!isNonblankFirstLine(bs)) return ielem('content', `Missing the visible content in the same line`, context);
  }
  const [attrs] = attributes('html', attrspecs[tag], as.slice(1, as.at(-1) === '>' ? -1 : as.length));
  if (/(?<!\S)invalid(?!\S)/.test(attrs['class'] ?? '')) return ielem('attribute', 'Invalid HTML attribute', context)
  if (as.at(-1) !== '>') return ielem('tag', `Missing the closing symbol ">"`, context);
  return h(tag as 'span', attrs, defrag(unwrap(bs)));
}

function ielem(type: string, message: string, context: Context): HTMLElement {
  return h('span',
    { class: 'invalid', ...invalid('html', type, message) },
    context.source.slice(context.position - context.range, context.position));
}

const requiredAttributes = memoize(
  (spec: Readonly<Record<string, readonly (string | undefined)[] | undefined>>) =>
    Object.entries(spec).flatMap(([k, v]) => v && Object.isFrozen(v) ? [k] : []),
  new WeakMap());

export function attributes(
  syntax: string,
  spec: Readonly<Record<string, readonly (string | undefined)[] | undefined>> | undefined,
  params: Iterable<string>,
): [Record<string, string | undefined>, string[]] {
  assert(spec instanceof Object === false);
  assert(!spec?.['__proto__']);
  assert(!spec?.toString);
  const remains = [];
  let invalidation = false;
  const attrs: Record<string, string | undefined> = {};
  for (const param of params) {
    const attr = param.trimStart();
    if (attr === '') continue;
    const name = attr.split('=', 1)[0];
    const value = attr !== name
      ? attr.slice(name.length + 2, -1).replace(/\\(.?)/g, '$1')
      : undefined;
    invalidation ||= name === '' || !spec || name in attrs;
    if (name === '') continue;
    if (spec && name in spec && !spec[name]) {
      remains.push(param);
      continue;
    }
    if (spec?.[name]?.includes(value) || spec?.[name]?.length === 0 && value !== undefined) {
      attrs[name] = value ?? ''
    }
    else {
      invalidation ||= !!spec;
    }
    assert(!(name in {} && attrs.hasOwnProperty(name)));
  }
  invalidation ||= !!spec && !requiredAttributes(spec).every(name => name in attrs);
  if (invalidation) {
    attrs['class'] = 'invalid';
    Object.assign(attrs, invalid(syntax, 'argument', 'Invalid argument'));
  }
  return [attrs, remains];
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// [...document.querySelectorAll('tbody > tr > td:first-child')].map(el => el.textContent.slice(1, -1))
const TAGS: readonly string[] = [
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
];

const tag2index: (tag: string) => number = eval([
  'tag => {',
  'switch(tag){',
  TAGS.map((tag, i) => `case '${tag}':return ${i};`).join(''),
  'default: throw new Error();',
  '}',
  '}',
].join(''));
