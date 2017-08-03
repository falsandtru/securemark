import { Cache } from 'spica/cache';

const cache = new Cache<string, HTMLElement>(100);

export function math(source: HTMLElement): void {
  const expr = source.textContent!;
  if (cache.has(expr)) {
    source.innerHTML = cache.get(expr)!.innerHTML;
  }
  else {
    void MathJax.Hub!.Queue(["Typeset", MathJax.Hub, source, () => void cache.set(expr, source)]);
  }
}
