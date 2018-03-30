import { LinkParser, inline } from '../inline';
import { union, some, surround, transform, build } from '../../combinator';
import { line } from '../source/line';
import { escsource } from '../source/escapable';
import { parenthesis } from '../source/parenthesis';
import { hasText, stringify, squash } from '../util';
import { sanitize } from '../string/url';
import { html } from 'typed-dom';

export const link: LinkParser = line(transform(build(() =>
  line(surround('[', some(union<LinkParser>([inline]), ']'), ']'), false)),
  (ns, rest) => {
    const children = squash(ns, document.createDocumentFragment());
    if (children.querySelector('a, .annotation') && !children.querySelector('.media')) return;
    if (children.querySelector('.media')) {
      if (children.childNodes.length > 1 || !children.firstElementChild || !children.firstElementChild.matches('.media')) return;
    }
    else {
      if (children.childNodes.length > 0 && !hasText(children)) return;
    }
    return transform(
      line(surround('(', some(union<LinkParser>([parenthesis, escsource]), /^\)|^\s(?!nofollow)/), ')'), false),
      (ns, rest) => {
        const [INSECURE_URL, attribute] = stringify(ns).replace(/\\(.)/g, '$1').split(/\s/);
        assert(attribute === undefined || attribute === 'nofollow');
        const url = sanitize(INSECURE_URL);
        assert(url === url.trim());
        if (INSECURE_URL !== '' && url === '') return;
        const el = html('a', {
          href: url,
          rel: attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener',
        });
        if (location.protocol !== el.protocol || location.host !== el.host) {
          void el.setAttribute('target', '_blank');
        }
        void el.appendChild(
          children.textContent || children.querySelector('.media')
            ? children
            : document.createTextNode((INSECURE_URL || el.href).replace(/^h(?=ttps?:\/\/)/, attribute === 'nofollow' ? '' : 'h')));
        assert(el.querySelector('.media') || hasText(el));
        return [[el], rest];
      })
      (rest);
  }
), false);
