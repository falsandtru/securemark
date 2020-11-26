import { document } from 'spica/global';
import { parse } from '../../../parser';
import { sanitize } from 'dompurify';
import { HTML, define } from 'typed-dom';
import { Collection } from 'spica/collection';

const origins = [
  'https://gist.github.com',
];

export function gist(url: URL, cache?: Collection<string, HTMLElement>): HTMLElement | undefined {
  if (!origins.includes(url.origin)) return;
  if (url.pathname.split('/').pop()!.includes('.')) return;
  if (!url.pathname.match(/^\/[\w-]+?\/\w{32}(?!\w)/)) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true);
  return HTML.div({ class: 'media', style: 'position: relative;' }, [HTML.em(`loading ${url.href}`)], (html, tag) => {
    const outer = html(tag);
    $.ajax(`${url.href}.json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ div, stylesheet, description }) {
        if (!stylesheet.startsWith('https://github.githubassets.com/')) return;
        outer.innerHTML = sanitize(`<div style="position: relative; margin-bottom: -1em;">${div}</div>`);
        const gist = outer.querySelector('.gist')! as HTMLElement;
        gist.insertBefore(
          html('div', { class: 'gist-description' }, [
            HTML.a({ style: 'color: #555; font-weight: 600;' }, description, () =>
              parse(`{ ${url.href} }`).querySelector('a')!).element,
          ]),
          gist.firstChild);
        cache?.set(url.href, outer.cloneNode(true));
        if (document.head.querySelector(`link[rel="stylesheet"][href="${stylesheet}"]`)) return;
        document.head.appendChild(html('link', {
          rel: 'stylesheet',
          href: stylesheet,
          crossorigin: 'anonymous',
        }));
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        define(outer, [parse(`*{ ${url.href} }*\n\n\`\`\`\n${status}\n${statusText}\n\`\`\``)]);
      },
    });
    return outer;
  }).element;
}
