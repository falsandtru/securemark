import { html } from 'typed-dom';

export function youtube(source: HTMLImageElement, url: URL): HTMLElement | undefined {
  const id = resolve(url);
  if (!id) return;
  return html('div', { class: source.className, 'data-type': 'youtube' }, [
    html('iframe', {
      src: `https://www.youtube.com/embed/${id}`,
      allow: 'fullscreen',
      loading: 'lazy',
    }),
  ]);
}

function resolve(url: URL): string | undefined {
  switch (url.origin) {
    case 'https://www.youtube.com':
      return url.pathname === '/watch/'
        ? url.href.slice(url.href.indexOf('?') + 1).replace('&', '?')
        : undefined;
    case 'https://youtu.be':
      return url.pathname.match(/^\/[\w-]+$/)
        ? url.href.slice(url.href.indexOf('/', url.href.indexOf('.')) + 1)
        : undefined;
    default:
      return;
  }
}
