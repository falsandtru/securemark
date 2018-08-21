import { cache } from '../../../parser/inline/media';
import DOM from 'typed-dom';

export function youtube(url: URL): HTMLElement | undefined {
  if (!['https://www.youtube.com', 'https://youtu.be'].includes(url.origin)) return;
  if (url.origin === 'https://www.youtube.com' && !url.pathname.match(/^\/watch$/)) return;
  if (url.origin === 'https://youtu.be' && !url.pathname.match(/^\/[\w\-]+$/)) return;
  if (cache.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLElement;
  return cache.set(
    url.href,
    DOM.div({ style: 'position: relative;' }, [
      DOM.div({ style: 'position: relative; padding-top: 56.25%;' }, [
        DOM.iframe({
          src: `https://www.youtube.com/embed/${
            url.origin === 'https://www.youtube.com' && url.href.replace(/.+?=/, '').replace(/&/, '?') ||
            url.origin === 'https://youtu.be' && url.href.slice(url.href.indexOf('/', 9) + 1)
            }`,
          allowfullscreen: '',
          frameborder: '0',
          style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
        }),
      ]),
    ]).element);
}
