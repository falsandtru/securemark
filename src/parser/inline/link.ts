import { LinkParser, inline } from '../inline';
import { union, inits, sequence, some, fmap, bind, match, surround, contract, subline, rewrite, focus, convert, lazy } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { escsource } from '../source/escapable';
import { char } from '../source/char';
import { defrag, wrap, startsWithTightText, hasContent, hasMedia, hasLink } from '../util';
import { sanitize, decode } from '../string/uri';
import { html, text } from 'typed-dom';

export const attributes: Record<string, Array<string | undefined>> = {
  nofollow: [undefined],
};

export const link: LinkParser = subline(bind(lazy(() => contract(
  /^(?:\[.*?\])?{.+?}/,
  convert(source => source[0] === '{' ? '[]' + source : source,
  sequence<LinkParser>([
    wrap(surround('[', defrag(some(union([inline]), /^[\n\]]/)), ']', false)),
    wrap(surround('{', inits([uri, some(defrag(attribute))]), /^ ?}/)),
  ])),
  ([text]) => {
    if (hasMedia(text)) {
      if (text.firstChild && text.firstChild.firstChild &&
          text.firstChild.firstChild === text.querySelector('a > .media')) {
        void text.replaceChild(text.firstChild.firstChild, text.firstChild);
      }
      if (text.childNodes.length !== 1) return false;
      if (!text.firstElementChild!.matches('.media')) return false;
    }
    else {
      if (text.childNodes.length > 0 && !startsWithTightText(text)) return false;
      if (hasLink(text)) return false;
    }
    assert(!hasLink(text) || text.firstElementChild!.matches('.media'));
    return true;
  })),
  ([text, param], rest) => {
    const [INSECURE_URL = '', ...params]: string[] = [...param.childNodes].map(t => t.textContent!);
    const path = sanitize(INSECURE_URL);
    if (path === '' && INSECURE_URL !== '') return;
    const attrs: Map<string, string | undefined> = new Map(params.map<[string, string | undefined]>(
      param => [param.split('=', 1)[0], param.includes('=') ? param.slice(param.split('=', 1)[0].length + 1) : undefined]));
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
    if (!check(attrs, params, attributes)) {
      void el.classList.add('invalid');
      void el.setAttribute('data-invalid-type', 'parameter');
    }
    return [[el], rest];
  }));

export const uri: LinkParser.ParamParser.UriParser = subline(defrag(match(
  /^ ?(?! )/,
  ([flag], rest) =>
    some(union<LinkParser.ParamParser.UriParser>([bracket, unescsource]), flag === ' ' ? /^\s/ : /^[\s}]/)
      (rest))));

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
    inits([
      focus(/^[a-z]+(?=[= }])/, some(unescsource)),
      rewrite(
        sequence([
          char('='),
          union([
            focus(/^[a-z]+(?=[= }])/, some(unescsource)),
            surround('"', some(escsource, '"'), '"', false),
          ]),
        ]),
        some(unescsource)),
    ]),
    ''));

export function check(
  attrs: Map<string, string | undefined>,
  params: string[],
  spec: Record<string, Array<string | undefined>>,
): boolean {
  return attrs.size === params.length
      && attrs.size >= [...Object.values(spec)].filter(Object.isFrozen).length
      && [...attrs.entries()]
          .every(([key, value]) =>
            spec.hasOwnProperty(key) &&
            spec[key].includes(value));
}
