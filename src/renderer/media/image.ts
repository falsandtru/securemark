export function image(source: HTMLImageElement): HTMLElement {
  const url = source.getAttribute('data-src')!;
  void source.setAttribute('src', url);
  return <HTMLElement>source.closest('a') || source;
}
