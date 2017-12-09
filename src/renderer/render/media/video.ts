import DOM from 'typed-dom';

export function video(url: string, alt: string): HTMLElement | void {
  if (!['.webm', '.ogv'].some(ext => url.split(/[?#]/, 1).shift()!.endsWith(ext)) || url.split('/').length < 4) return;
  return DOM.video({
    class: 'media',
    src: url,
    alt,
    muted: '',
    controls: '',
    style: 'max-width: 100%;',
  }).element;
}
