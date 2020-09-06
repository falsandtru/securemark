import { undefined } from 'spica/global';
import { cache } from '../../parser/inline/math';
import { define } from 'typed-dom';

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

async function queue(target: HTMLElement, callback = () => undefined): Promise<void> {
  // @ts-ignore
  MathJax.typesetPromise || await MathJax.startup.promise;
  // @ts-ignore
  MathJax.typesetPromise([target]).then(callback);
}
