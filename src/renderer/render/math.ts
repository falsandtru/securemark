import { cache } from '../../parser/inline/math';
import { define } from 'typed-dom';

void MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [['${', '}$']],
    displayMath: [['$$', '$$']],
  },
});

export function math(target: HTMLElement): void {
  assert(target.children.length === 0);
  const source = target.textContent!;
  return cache.has(source)
    ? void define(target, cache.get(source)!.cloneNode(true).childNodes)
    : void queue(target, () =>
        target.matches('span')
          ? void cache.set(source, target.cloneNode(true))
          : undefined);
}

function queue(target: HTMLElement, callback = () => undefined): void {
  void MathJax.Hub.Queue(['Typeset', MathJax.Hub, target, callback]);
}
