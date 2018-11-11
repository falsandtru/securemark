import { parse } from '../../../parser';
import { cache } from '../../../parser/inline/media';
import { sanitize } from 'dompurify';
import DOM, { html, define } from 'typed-dom';

const origins = new Set([
  'https://gist.github.com',
]);

export function gist(url: URL): HTMLElement | undefined {
  if (!origins.has(url.origin)) return;
  if (!url.pathname.match(/^\/[\w\-]+?\/\w{32}(?!\w)/)) return;
  if (cache.has(url.href)) return cache.get(url.href)!.cloneNode(true);
  return DOM.div({ style: 'position: relative;' }, [DOM.em(`loading ${url.href}`)], (f, tag) => {
    const outer = f(tag);
    void $.ajax(`${url.href}.json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ div, stylesheet, description }) {
        if (!stylesheet.startsWith('https://assets-cdn.github.com/')) return;
        outer.innerHTML = sanitize(`<div style="position: relative; margin-bottom: -1em;">${div}</div>`);
        const gist = outer.querySelector('.gist')! as HTMLElement;
        void gist.insertBefore(
          html('div', { class: 'gist-description' }, [
            DOM.a({ style: 'color: #555; font-weight: 600;' }, description, () =>
              parse(`[]{ ${url.href} }`).querySelector('a')!).element,
          ]),
          gist.firstChild);
        void cache.set(url.href, outer.cloneNode(true));
        if (document.head!.querySelector(`link[rel="stylesheet"][href="${stylesheet}"]`)) return;
        void document.head!.appendChild(html('link', {
          rel: 'stylesheet',
          href: stylesheet,
          crossorigin: 'anonymous',
        }));
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        void define(outer, [parse(`*[]{ ${url.href} }*\n\n\`\`\`\n${status}\n${statusText}\n\`\`\``)]);
      },
    });
    return outer;
  }).element;
}
