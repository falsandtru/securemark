import { parse, escape } from '../../../parser';
import { cache } from '../../../parser/inline/media';
import { sanitize } from 'dompurify';
import DOM, { html } from 'typed-dom';

export function slideshare(url: string): HTMLElement {
  if (cache.has(url)) return cache.get(url)!.cloneNode(true) as HTMLElement;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = html('div');
    void $.ajax(`https://www.slideshare.net/api/oembed/2?url=${url}&format=json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ html }) {
        outer.innerHTML = sanitize(`<div style="position: relative; padding-top: 83%;">${html}</div>`, { ADD_TAGS: ['iframe'] });
        const iframe = outer.querySelector('iframe')!;
        void iframe.setAttribute('style', 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;');
        iframe.parentElement!.style.paddingTop = `${(+iframe.height / +iframe.width) * 100}%`;
        void outer.appendChild(iframe.nextElementSibling!);
        void outer.lastElementChild!.removeAttribute('style');
        void cache.set(url, outer.cloneNode(true) as HTMLElement);
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        outer.innerHTML = parse(`*${escape(url)}\\\n-> ${status}: ${escape(statusText)}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
