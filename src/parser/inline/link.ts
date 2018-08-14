import { LinkParser, inline } from '../inline';
import { Parser, union, inits, some, fmap, bind, surround, subline, focus, build } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { compress, hasText, hasContent, hasMedia, hasLink } from '../util';
import { sanitize, decode } from '../string/uri';
import { memoize } from 'spica/memoization';
import { html, text, frag } from 'typed-dom';

const closer = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}\\)|^\\s`));
const attributes: Record<string, Array<string | undefined>> = {
  nofollow: [undefined],
};

export const link: LinkParser = subline(bind(build(() =>
  subline(surround('[', compress(some(union([inline]), ']')), /^\](?=\(( ?)[^\n]*?\1\))/, false))),
  (ns, rest) => {
    const children = frag(ns);
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
      subline(surround(
        '(',
        inits<LinkParser>([
          surround(
            /^ ?(?! )/,
            compress(some(
              union<Parser<Text, [typeof bracket, typeof unescsource]>>([bracket, unescsource]),
              closer(rest[1] === ' ' ? ' ' : ''))),
            /^ ?(?=\))|^ /,
            false),
          some(surround('', compress(attribute), /^ |^(?=\))/))
        ]),
        ')',
        false)),
      (ts, rest) => {
        const [INSECURE_URL = '', ...args]: string[] = ts.map(t => t.textContent!);
        const uri = sanitize(INSECURE_URL);
        if (uri === '' && INSECURE_URL !== '') return;
        const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
          arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
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
        if (el.textContent!.trim().match(/^[#@]/)) return;
        if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=\d)/g, '')}`) return;
        if ((el.origin !== window.location.origin || hasMedia(el)) && el.protocol !== 'tel:') {
          void el.setAttribute('target', '_blank');
        }
        if (attrs.size !== args.length) {
          void el.classList.add('invalid');
        }
        for (const [key, value] of attrs.entries()) {
          if (attributes.hasOwnProperty(key) && attributes[key].includes(value)) continue;
          void el.classList.add('invalid');
        }
        return [[el], rest];
      })
      (rest);
  }));

export const bracket: LinkParser.BracketParser = subline(build(() => union([
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
])));

export const attribute: LinkParser.AttributeParser = subline(focus(
  /^[a-z]+(?:=[^\s)]+)?/,
  some(union([unescsource]))));
