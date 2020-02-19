import { isFrozen, ObjectCreate, ObjectEntries, ObjectFreeze, ObjectSetPrototypeOf, ObjectValues } from 'spica/alias';
import { MarkdownParser } from '../../../markdown';
import { HTMLParser, inline } from '../inline';
import { Ctx, union, some, validate, creator, backtracker, surround, match, memoize, context, lazy } from '../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../util';
import { str } from '../source';
import { DeepImmutable, DeepMutable } from 'spica/type';
import { memoize as memo } from 'spica/memoize';
import { html as h } from 'typed-dom';
import { unshift, push } from 'spica/array';

const tags = ObjectFreeze(['sup', 'sub', 'small', 'bdo', 'bdi']);
const attributes = {
  bdo: {
    dir: ObjectFreeze(['ltr', 'rtl'] as const),
  },
} as const;
void ObjectSetPrototypeOf(attributes, null);
void ObjectValues(attributes).forEach(o => void ObjectSetPrototypeOf(o, null));

export const html: HTMLParser = lazy(() => creator(validate('<', union([
  match(
    /^(?=<(wbr)(?=[ >]))/,
    memoize(([, tag]) => tag,
    tag =>
      surround(
        str(`<${tag}`),
        some(union([attribute])),
        backtracker(str('>')), true,
        ([, as = []], rest) => [
          [h(tag as 'span', makeAttrs(attributes[tag], as.map(t => t.data), [], 'html'))],
          rest
        ]))),
  match(
    /^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/,
    memoize(([, tag]) => tag,
    tag =>
      surround(surround(
        str(`<${tag}`),
        some(union([attribute])),
        backtracker(str('>')), true),
        startTight(
        context((() => {
          switch (tag) {
            case 'bdo':
            case 'bdi':
              return {
                state: { in: { bdx: true } }
              };
            case 'sup':
            case 'sub':
              return {
                state: { in: { supsub: true } },
                syntax: { inline: {
                  annotation: false,
                  reference: false,
                }},
              };
            case 'small':
            default:
              return {
                state: { in: { small: true } }
              };
          }
        })(),
        some(union([inline]), `</${tag}>`))),
        backtracker(str(`</${tag}>`)), false,
        ([as, bs, cs], rest, _, context: DeepMutable<Ctx>) =>
          isTight(bs, 0, bs.length) || context.resource && void --context.resource.backtrack
            ? [[elem(tag, as, trimEnd(bs), cs, context)], rest]
            : void 0))),
  match(
    /^(?=<([a-z]+)(?=[ >]))/,
    // Don't memoize this function because this key size is unlimited
    // and it makes a vulnerability of memory leaks.
    ([, tag]) =>
      surround(surround(
        str(`<${tag}`),
        some(union([attribute])),
        backtracker(str('>')), true),
        startTight(
        some(union([inline]), `</${tag}>`)),
        backtracker(str(`</${tag}>`)), false,
        ([as, bs, cs], rest, _, context: DeepMutable<Ctx>) =>
          isTight(bs, 0, bs.length) || context.resource && void --context.resource.backtrack
            ? [[elem(tag, as, trimEnd(bs), cs, {})], rest]
            : void 0)),
]))));

export const attribute: HTMLParser.TagParser.AttributeParser = creator(union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/),
]));

function elem(tag: string, as: (HTMLElement | Text)[], bs: (HTMLElement | Text)[], cs: (HTMLElement | Text)[], context: MarkdownParser.Context): HTMLElement {
  let attrs: Record<string, string | undefined>;
  if (!tags.includes(tag)) {
    return invalid('Invalid HTML tag', as, bs, cs);
  }
  switch (tag) {
    case 'bdo':
    case 'bdi':
      switch (true) {
        case context.state?.in?.bdx:
          return invalid('Nested HTML tag', as, bs, cs);
      }
      break;
    case 'sup':
    case 'sub':
      switch (true) {
        case context.state?.in?.supsub:
          return invalid('Nested HTML tag', as, bs, cs);
      }
      break;
    case 'small':
      switch (true) {
        case context.state?.in?.supsub:
        case context.state?.in?.small:
          return invalid('Nested HTML tag', as, bs, cs);
      }
      break;
  }
  switch (true) {
    case as[as.length - 1].textContent !== '>'
      || 'data-invalid-syntax' in (attrs = makeAttrs(attributes[tag], as.slice(1, -1).map(a => a.textContent!), [], 'html')):
      return invalid('Invalid HTML attribute', as, bs, cs);
    case cs.length === 0:
      return invalid('Unclosed HTML tag', as, bs, cs);
    default:
      return defrag(h(tag as 'span', attrs!, bs));
  }
}
function invalid(message: string, as: Node[], bs: Node[], cs: Node[]): HTMLElement {
  return defrag(h('span', {
    class: 'invalid',
    'data-invalid-syntax': 'html',
    'data-invalid-message': message,
  }, push(unshift(as, bs), cs)));
}

const requiredAttributes = memo(
  (spec: DeepImmutable<Record<string, Array<string | undefined>>>) =>
    ObjectEntries(spec).filter(([, v]) => isFrozen(v)),
  new WeakMap());

export function makeAttrs(
  spec: DeepImmutable<Record<string, Array<string | undefined>>> | undefined,
  params: string[],
  classes: string[],
  syntax: string,
): Record<string, string | undefined> {
  let invalid = classes.includes('invalid');
  const attrs = params
    .reduce<Record<string, string>>((attrs, param) => {
      assert(param[0] === ' ');
      param = param.slice(1);
      const key = param.split('=', 1)[0];
      const val = param.includes('=')
        ? param.slice(key.length + 2, -1).replace(/\\(.?)/g, '$1')
        : void 0;
      invalid = invalid || !spec || key in attrs;
      spec?.[key]?.includes(val)
        ? attrs[key] = val || ''
        : invalid = invalid || !!spec;
      return attrs;
    }, ObjectCreate(null));
  invalid = invalid || !!spec && !requiredAttributes(spec).every(([k]) => k in attrs);
  if (invalid) {
    void classes.push('invalid');
    attrs.class = classes.join(' ').trim();
    attrs['data-invalid-syntax'] = syntax;
    attrs['data-invalid-message'] = syntax === 'html'
      ? 'Invalid attribute'
      : 'Invalid parameter';
  }
  return attrs;
}
