import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLElement>(100);

export function math(source: HTMLElement): void {
  if (source.children.length > 0) return;
  const expr = source.textContent!;
  if (cache.has(expr)) {
    source.innerHTML = cache.get(expr)!.innerHTML;
  }
  else {
    void source.setAttribute('data-src', source.textContent!);
    void MathJax.Hub!.Queue(["Typeset", MathJax.Hub, source, () => void cache.set(expr, <HTMLElement>source.cloneNode(true))]);
  }
}
