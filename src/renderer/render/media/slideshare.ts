import DOM from 'typed-dom';
import { parse, escape } from '../../parser';
import { Cache } from 'spica/cache';
import { sanitize } from 'dompurify';

const cache = new Cache<string, HTMLElement>(100);

export function slideshare(url: string): HTMLElement | void {
  if (!url.startsWith('https://www.slideshare.net/')) return;
  if (cache.has(url)) return cache.get(url)!.cloneNode(true) as HTMLElement;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`https://www.slideshare.net/api/oembed/2?url=${url}&format=json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      success({ html }) {
        outer.innerHTML = sanitize(`<div style="position: relative; padding-top: 83%;">${html}</div>`, { ADD_TAGS: ['iframe'] });
        const iframe = outer.querySelector('iframe')!;
        void iframe.setAttribute('style', 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;');
        iframe.parentElement!.style.paddingTop = `${(+iframe.height / +iframe.width) * 100}%`;
        void outer.appendChild(iframe.nextElementSibling!);
        void outer.lastElementChild!.removeAttribute('style');
        void cache.set(url, outer.cloneNode(true) as HTMLElement);
      },
      error({ statusText }) {
        outer.innerHTML = parse(`*${escape(url)}\\\n-> ${escape(statusText)}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
