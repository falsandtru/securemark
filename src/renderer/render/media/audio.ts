import DOM from 'typed-dom';

export function audio(url: string, alt: string): HTMLElement | void {
  if (!['.oga', '.ogg'].some(ext => url.split(/[?#]/, 1).shift()!.endsWith(ext)) || url.split('/').length < 4) return;
  return DOM.video({
    class: 'media',
    src: url,
    alt,
    controls: '',
    style: 'width: 100%;',
  }).element;
}
