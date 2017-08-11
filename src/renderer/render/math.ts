import { cache } from '../../parser/inline/math';

export function math(target: HTMLElement): void {
  assert(target.children.length === 0);
  if (target instanceof HTMLDivElement) return void MathJax.Hub!.Queue(["Typeset", MathJax.Hub, target]);
  void target.setAttribute('data-src', target.textContent!);
  const expr = target.textContent!;
  if (cache.has(expr)) {
    target.innerHTML = cache.get(expr)!.innerHTML;
  }
  else {
    void MathJax.Hub!.Queue(["Typeset", MathJax.Hub, target, () =>
      void cache.set(expr, target.cloneNode(true) as HTMLElement)]);
  }
}
