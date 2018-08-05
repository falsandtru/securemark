import { LinkParser, inline } from '../inline';
import { Parser, union, subsequence, some, match, surround, fmap, bind, build } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { compress, hasText, hasContent, hasMedia, hasLink, hasAnnotationOrAuthority } from '../util';
import { sanitize, decode } from '../string/uri';
import { html, text, frag } from 'typed-dom';

export const link: LinkParser = line(bind(build(() =>
  line(surround('[', compress(some(union([inline]), ']')), ']', false), false)),
  (ns, rest) => {
    const children = frag(ns);
    if (hasAnnotationOrAuthority(children)) return;
    if (hasMedia(children)) {
      void children.querySelectorAll('a > .media')
        .forEach(el =>
          void el.parentNode!.parentNode!.replaceChild(el, el.parentNode!))
      if (children.childNodes.length !== 1) return;
      if (!children.firstElementChild!.matches('.media')) return;
      assert(!hasLink(children));
    }
    else {
      if (children.childNodes.length > 0 && !hasText(children)) return;
      if (hasLink(children)) return;
    }
    assert(children.querySelector('a > .media') || !hasLink(children));
    return bind(
      line(surround(
        '(',
        subsequence<LinkParser>([
          compress(surround(
            /^ ?(?! )/,
            some(union<Parser<Text, [typeof bracket, typeof unescsource]>>([bracket, unescsource]), new RegExp(`^\\)${rest[1] === ' ' ? ' ' : ''}|^\\s`)),
            /^ ?(?=\))|^ /,
            false)),
          some(surround('', attribute, /^ ?(?=\))|^ /))
        ]),
        ')',
        false
      ), false),
      (ts, rest) => {
        assert(ts.length <= 2);
        const [INSECURE_URL = '', ...args] = ts.map(t => t.textContent!);
        const uri = sanitize(INSECURE_URL);
        if (uri === '' && INSECURE_URL !== '') return;
        const attrs = new Map<string, string | undefined>(args.map<[string, string | undefined]>(arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
        if (attrs.size !== args.length) return;
        const el = html('a',
          {
            href: uri,
            rel: `noopener ${attrs.has('nofollow') ? 'nofollow noreferrer' : ''}`.trim(),
          },
          hasContent(children)
            ? children.childNodes
            : sanitize(decode(INSECURE_URL || '.'))
                .replace(/^tel:/, '')
                .replace(/^h(?=ttps?:\/\/)/, attrs.has('nofollow') ? '' : 'h'));
        assert(hasContent(el));
        if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=\d)/g, '')}`) return;
        if ((window.location.origin !== el.origin || hasMedia(el)) && el.protocol !== 'tel:') {
          void el.setAttribute('target', '_blank');
        }
        if (el.textContent!.trim().match(/^[#@]/)) return;
        for (const [key, value] of attrs.entries()) {
          switch (key) {
            // @ts-ignore
            case 'nofollow':
              if (value === undefined) continue;
            default:
              void el.classList.add('invalid');
          }
          break;
        }
        return [[el], rest];
      })
      (rest);
  }
), false);

export const ipv6 = fmap(
  surround('[', match(/^[:0-9a-z]+/, ([addr], rest) => [[text(addr)], rest]), ']'),
  ts => [text('['), ...ts, text(']')]);

export const bracket: LinkParser.BracketParser = build(() => union([
  fmap(
    surround('(', some(union([bracket, unescsource]), /^[\)\s]/), ')', false),
    ts => [text('('), ...ts, text(')')]),
  fmap(
    surround('[', some(union([bracket, unescsource]), /^[\]\s]/), ']', false),
    ts => [text('['), ...ts, text(']')]),
  fmap(
    surround('{', some(union([bracket, unescsource]), /^[\}\s]/), '}', false),
    ts => [text('{'), ...ts, text('}')]),
  fmap(
    surround('<', some(union([bracket, unescsource]), /^[\>\s]/), '>', false),
    ts => [text('<'), ...ts, text('>')]),
]));

const attribute: LinkParser.AttributeParser =
  match(/^[a-z]+(?:=[^\s)]+)?/, ([attr], rest) =>
    [[text(attr)], rest]);
