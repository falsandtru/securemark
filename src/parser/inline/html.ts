import { undefined, RegExp } from 'spica/global';
import { isFrozen, ObjectCreate, ObjectEntries, ObjectFreeze, ObjectSetPrototypeOf, ObjectValues } from 'spica/alias';
import { MarkdownParser } from '../../../markdown';
import { HTMLParser, inline } from '../inline';
import { union, some, validate, context, creator, surround, match, memoize, lazy } from '../../combinator';
import { startTight, isEndTight, trimEnd, defrag, stringify } from '../util';
import { str } from '../source';
import { DeepImmutable } from 'spica/type';
import { memoize as memo } from 'spica/memoize';
import { html as h } from 'typed-dom';
import { unshift, push, join } from 'spica/array';

const tags = ObjectFreeze(['sup', 'sub', 'small', 'bdo', 'bdi']);
const attrspec = {
  bdo: {
    dir: ObjectFreeze(['ltr', 'rtl'] as const),
  },
} as const;
ObjectSetPrototypeOf(attrspec, null);
ObjectValues(attrspec).forEach(o => ObjectSetPrototypeOf(o, null));

export const html: HTMLParser = lazy(() => creator(validate('<', union([
  match(
    /^(?=<(wbr)(?=[ >]))/,
    memoize(([, tag]) => tag,
    tag =>
      surround(
        str(`<${tag}`), some(union([attribute])), str('>'), true,
        ([, as = []], rest) => [
          [h(tag as 'span', attributes('html', attrspec[tag], as, []))],
          rest
        ]))),
  match(
    /^(?=<(sup|sub|small|bdo|bdi)(?=[ >]))/,
    memoize(([, tag]) => tag,
    tag =>
      validate(new RegExp(`^<${tag}[^\\n>]*>\\S[\\s\\S]*?</${tag}>`),
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str('>'), true),
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
        str(`</${tag}>`), false,
        ([as, bs, cs], rest, context) =>
          isEndTight(bs)
            ? [[elem(tag, as, trimEnd(bs), cs, context)], rest]
            : undefined)))),
  match(
    /^(?=<([a-z]+)(?=[ >]))/,
    // Don't memoize this function because this key size is unlimited
    // and it makes a vulnerability of memory leaks.
    ([, tag]) =>
      surround<HTMLParser.TagParser, string>(surround(
        str(`<${tag}`), some(attribute), str('>'), true),
        startTight(some(union([inline]), `</${tag}>`)),
        str(`</${tag}>`), false,
        ([as, bs, cs], rest) =>
          isEndTight(bs)
            ? [[elem(tag, as, trimEnd(bs), cs, {})], rest]
            : as.length === 1
              ? [push(unshift(as, bs), cs), rest]
              : undefined,
        ([as, bs], rest) =>
          as.length === 1
            ? [unshift(as, bs), rest]
            : undefined)),
]))));

export const attribute: HTMLParser.TagParser.AttributeParser = union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ >])/),
]);

function elem(tag: string, as: (HTMLElement | string)[], bs: (HTMLElement | string)[], cs: (HTMLElement | string)[], context: MarkdownParser.Context): HTMLElement {
  if (!tags.includes(tag)) {
    return invalid('tag', 'Invalid HTML tag.', as, bs, cs);
  }
  switch (tag) {
    case 'bdo':
    case 'bdi':
      switch (true) {
        case context.state?.in?.bdx:
          return invalid('nest', 'Cannot nest bdo/bdi HTML tag.', as, bs, cs);
      }
      break;
    case 'sup':
    case 'sub':
      switch (true) {
        case context.state?.in?.supsub:
          return invalid('nest', 'Cannot nest sup/sub HTML tag.', as, bs, cs);
      }
      break;
    case 'small':
      switch (true) {
        case context.state?.in?.supsub:
        case context.state?.in?.small:
          return invalid('nest', 'Cannot nest small HTML tag.', as, bs, cs);
      }
      break;
  }
  let attrs: Record<string, string | undefined> | undefined;
  switch (true) {
    case stringify(as[as.length - 1]) !== '>'
      || 'data-invalid-syntax' in (attrs = attributes('html', attrspec[tag], as.slice(1, -1).map(stringify), [])):
      return invalid('attribute', 'Invalid HTML attribute.', as, bs, cs);
    case cs.length === 0:
      return invalid('closer', 'Missing the closing HTML tag.', as, bs, cs);
    default:
      return h(tag as 'span', attrs, defrag(bs));
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

const requiredAttributes = memo(
  (spec: DeepImmutable<Record<string, Array<string | undefined>>>) =>
    ObjectEntries(spec).filter(([, v]) => isFrozen(v)),
  new WeakMap());

export function attributes(
  syntax: string,
  spec: DeepImmutable<Record<string, Array<string | undefined>>> | undefined,
  params: string[],
  classes: string[],
): Record<string, string | undefined> {
  assert(spec instanceof Object === false);
  assert(params.every(param => param.match(/^ \w+(=".*?")?$/)));
  assert(!classes.includes('invalid'));
  let invalid = false;
  const attrs = params
    .reduce<Record<string, string>>((attrs, param) => {
      assert(attrs instanceof Object === false);
      assert(param[0] === ' ');
      param = param.slice(1);
      const key = param.split('=', 1)[0];
      const val = param !== key
        ? param.slice(key.length + 2, -1).replace(/\\(.?)/g, '$1')
        : undefined;
      invalid = invalid || !spec || key in attrs;
      spec?.[key]?.includes(val)
        ? attrs[key] = val || ''
        : invalid = invalid || !!spec;
      return attrs;
    }, ObjectCreate(null));
  invalid = invalid || !!spec && !requiredAttributes(spec).every(([k]) => k in attrs);
  if (invalid) {
    classes.push('invalid');
    attrs.class = join(classes, ' ').trim();
    attrs['data-invalid-syntax'] = syntax;
    attrs['data-invalid-type'] = syntax === 'html'
      ? 'attribute'
      : 'parameter';
    attrs['data-invalid-message'] = `Invalid ${attrs['data-invalid-type']}.`;
  }
  return attrs;
}
