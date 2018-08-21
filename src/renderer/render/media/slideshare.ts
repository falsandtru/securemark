import { parse } from '../../../parser';
import { cache } from '../../../parser/inline/media';
import { sanitize } from 'dompurify';
import DOM, { html, define } from 'typed-dom';

export function slideshare(url: URL): HTMLElement | undefined {
  if (!['https://www.slideshare.net'].includes(url.origin)) return;
  if (!url.pathname.match(/^\/[^/?#]+\/[^/?#]+/)) return;
  if (cache.has(url.href)) return cache.get(url.href)!.cloneNode(true);
  return DOM.div({ style: 'position: relative;' }, [DOM.em(`loading ${url.href}`)], () => {
    const outer = html('div');
    void $.ajax(`https://www.slideshare.net/api/oembed/2?url=${url.href}&format=json`, {
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
        void cache.set(url.href, outer.cloneNode(true));
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        void define(outer, [parse(`*[]( ${url.href} )*\n\n\`\`\`\n${status}\n${statusText}\n\`\`\``)]);
      },
    });
    return outer;
  }).element;
}
