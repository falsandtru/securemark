import DOM from 'typed-dom';
import { parse } from '../parser';

export function slideshare(source: HTMLImageElement): HTMLElement | void {
  const url = source.getAttribute('data-src')!;
  if (!url.startsWith('https://www.slideshare.net/')) return;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`https://www.slideshare.net/api/oembed/2?url=https://www.slideshare.net/${url.split('//www.slideshare.net/', 2).pop()}&format=json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      success({ html }) {
        outer.innerHTML = `<div style="position: relative; padding-top: 83%;">${html}</div>`;
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
