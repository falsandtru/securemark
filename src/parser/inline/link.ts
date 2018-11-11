import { LinkParser, inline } from '../inline';
import { union, inits, sequence, some, fmap, bind, match, surround, subline, focus, verify, lazy } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { compress, startsWithTightText, hasContent, hasMedia, hasLink } from '../util';
import { sanitize, decode } from '../string/uri';
import { html, text, frag } from 'typed-dom';

const attributes: Record<string, Array<string | undefined>> = {
  nofollow: [undefined],
};

export const link: LinkParser = subline(bind(lazy(() =>
  sequence<LinkParser>([
    verify(fmap(
      surround(/^\[(?=\]|\S.*?\]{.*})/, compress(some(union([inline]), /^[\n\]]/)), /^\](?={( ?)[^\n]*?\1})/, false),
      ns => [frag(ns)]),
      ([text]) => {
        if (hasMedia(text)) {
          void text.querySelectorAll('a > .media')
            .forEach(el =>
              void el.parentNode!.parentNode!.replaceChild(el, el.parentNode!))
          if (text.childNodes.length !== 1) return false;
          if (!text.firstElementChild!.matches('.media')) return false;
        }
        else {
          if (text.childNodes.length > 0 && !startsWithTightText(text)) return false;
          if (hasLink(text)) return false;
        }
        assert(!hasLink(text) || text.firstElementChild!.matches('.media'));
        return true;
      }),
    fmap(
      surround('{', inits<LinkParser.ParamParser>([uri, some(compress(attribute))]), /^ ?}/),
      ts => [frag(ts)]),
  ])),
  ([text, param], rest) => {
    const [INSECURE_URL = '', ...args]: string[] = [...param.childNodes].map(t => t.textContent!);
    const path = sanitize(INSECURE_URL);
    if (path === '' && INSECURE_URL !== '') return;
    const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
      arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
    const el = html('a',
      {
        href: path,
        rel: `noopener${attrs.has('nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      hasContent(text)
        ? text.childNodes
        : sanitize(decode(INSECURE_URL || '.'))
            .replace(/^tel:/, '')
            .replace(/^h(?=ttps?:\/\/)/, attrs.has('nofollow') ? '' : 'h'));
    assert(hasContent(el));
    if (el.textContent!.trim().match(/^[#@]/)) return;
    if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}`) return;
    if ((el.origin !== window.location.origin || hasMedia(el)) && el.protocol !== 'tel:') {
      void el.setAttribute('target', '_blank');
    }
    if (!check(attrs, args, attributes)) {
      void el.classList.add('invalid');
      void el.setAttribute('data-invalid-type', 'parameter');
    }
    return [[el], rest];
  }));

export const uri: LinkParser.ParamParser.UriParser = subline(match(
  /^ ?(?! )/,
  ([flag], rest) =>
    compress(some(
      union<LinkParser.ParamParser.UriParser>([bracket, unescsource]),
      flag === ' ' ? /^\s/ : /^[\s}]/))
      (rest)));

export const bracket: LinkParser.ParamParser.UriParser.BracketParser = subline(lazy(() => union([
  fmap(
    surround('(', some(union([bracket, unescsource]), /^[\s\)]/), ')', false),
    ts => [text('('), ...ts, text(')')]),
  fmap(
    surround('[', some(union([bracket, unescsource]), /^[\s\]]/), ']', false),
    ts => [text('['), ...ts, text(']')]),
  fmap(
    surround('{', some(union([bracket, unescsource]), /^[\s\}]/), '}', false),
    ts => [text('{'), ...ts, text('}')]),
  fmap(
    surround('<', some(union([bracket, unescsource]), /^[\s\>]/), '>', false),
    ts => [text('<'), ...ts, text('>')]),
  fmap(
    surround('"', some(union([bracket, unescsource]), /^[\s\"]/), '"', false),
    ts => [text('"'), ...ts, text('"')]),
])));

export const attribute: LinkParser.ParamParser.AttributeParser = subline(
  surround(
    ' ',
    focus(/^[a-z]+(?:=[^\s}]+)?/, some(union([unescsource]))),
    ''));

export function check(
  attrs: Map<string, string | undefined>,
  args: string[],
  spec: Record<string, Array<string | undefined>>,
): boolean {
  return attrs.size === args.length
      && attrs.size >= [...Object.values(spec)].filter(Object.isFrozen).length
      && [...attrs.entries()]
          .every(([key, value]) =>
            spec.hasOwnProperty(key) &&
            spec[key].includes(value));
}
