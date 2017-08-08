import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100); // for rerendering in editing

export function code(source: HTMLElement): void {
  if (source.children.length > 0) return;
  if (source instanceof HTMLPreElement) return void Prism.highlightElement(source, true);
  void source.setAttribute('data-src', source.textContent!);
  const expr = source.textContent!;
  if (cache.has(expr)) {
    source.innerHTML = cache.get(expr)!.innerHTML;
  }
  else {
    void Prism.highlightElement(source, true, () =>
      void cache.set(expr, <HTMLElement>source.cloneNode(true)));
  }
}
