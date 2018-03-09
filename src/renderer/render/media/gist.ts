import { parse, escape } from '../../../parser';
import { cache } from '../../../parser/inline/media';
import { sanitize } from 'dompurify';
import DOM, { html } from 'typed-dom';

export function gist(url: string): HTMLElement {
  if (cache.has(url)) return cache.get(url)!.cloneNode(true);
  return DOM.div({
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = html('div');
    void $.ajax(`${url}.json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ div, stylesheet, description }) {
        if (!stylesheet.startsWith('https://assets-cdn.github.com/')) return;
        outer.innerHTML = sanitize(`<div style="position: relative; margin-bottom: -1em;">${div}</div>`);
        const gist = outer.querySelector('.gist')! as HTMLElement;
        void gist.insertBefore(
          DOM.div({ class: 'gist-description' }, [
            DOM.a({ style: 'color: #555; font-size: 14px; font-weight: 600;' }, description, () =>
              parse(escape(url)).querySelector('a')!),
          ]).element,
          gist.firstChild);
        void cache.set(url, outer.cloneNode(true));
        if (document.head.querySelector(`link[rel="stylesheet"][href="${stylesheet}"]`)) return;
        void document.head.appendChild(html('link', {
          rel: 'stylesheet',
          href: stylesheet,
          crossorigin: 'anonymous',
        }));
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        outer.innerHTML = parse(`*${escape(url)}\\\n-> ${status}: ${escape(statusText)}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
