import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

const origins = new Set([
  'https://www.youtube.com',
  'https://youtu.be',
]);

export function youtube(url: URL, cache?: Cache<string, HTMLElement>): HTMLElement | undefined {
  if (!origins.has(url.origin)) return;
  if (url.pathname.split('/').pop()!.includes('.')) return;
  if (url.origin === 'https://www.youtube.com' && !url.pathname.match(/^\/watch$/)) return;
  if (url.origin === 'https://youtu.be' && !url.pathname.match(/^\/[\w-]+$/)) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLElement;
  const el = html('div', { class: 'media', style: 'position: relative;' }, [
    html('div', { style: 'position: relative; padding-top: 56.25%;' }, [
      html('iframe', {
        src: `https://www.youtube.com/embed/${url.origin === 'https://www.youtube.com' && url.href.replace(/.+?=/, '').replace(/&/, '?') ||
          url.origin === 'https://youtu.be' && url.href.slice(url.href.indexOf('/', 9) + 1)
          }`,
        allowfullscreen: '',
        frameborder: '0',
        style: 'position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
      }),
    ]),
  ]);
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
