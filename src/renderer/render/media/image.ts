export function image(source: HTMLImageElement): HTMLElement {
  void source.setAttribute('src', source.getAttribute('data-src')!);
  return <HTMLElement>source.closest('a') || source;
}
