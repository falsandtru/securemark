import { cache } from '../../parser/inline/math';
import { define } from 'typed-dom';

export function math(target: HTMLElement): void {
  assert(target.children.length === 0);
  if (target instanceof HTMLDivElement) return void queue(target);
  void target.setAttribute('data-src', target.textContent!);
  const expr = target.textContent!;
  if (cache.has(expr)) return void define(target, cache.get(expr)!.cloneNode(true).childNodes);
  void queue(target, () =>
    void cache.set(expr, target.cloneNode(true)));
}

function queue(target: HTMLElement, callback = () => undefined): void {
  void MathJax.Hub.Queue(['Typeset', MathJax.Hub, target, callback]);
}
