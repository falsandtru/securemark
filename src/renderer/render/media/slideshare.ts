import DOM from 'typed-dom';
import { parse } from '../../parser';
import { Cache } from 'spica/cache';

const cache = new Cache<string, HTMLElement>(100);

export function slideshare(url: string): HTMLElement | void {
  if (!url.startsWith('https://www.slideshare.net/')) return;
  if (cache.has(url)) return <HTMLElement>cache.get(url)!.cloneNode(true);
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`https://www.slideshare.net/api/oembed/2?url=${url}&format=json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      success({ html }) {
        outer.innerHTML = `<div style="position: relative; padding-top: 83%;">${html}</div>`;
        void cache.set(url, outer);
        const iframe = outer.querySelector('iframe')!;
        void iframe.setAttribute('style', 'position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;');
        iframe.parentElement!.style.paddingTop = `${(+iframe.height / +iframe.width) * 100}%`;
        void outer.appendChild(iframe.nextElementSibling!);
        void outer.lastElementChild!.removeAttribute('style');
      },
      error({ statusText }) {
        outer.innerHTML = parse(`*${url}\\\n-> ${statusText}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
