import { undefined } from 'spica/global';
import { cache } from '../../parser/inline/math';

export function math(target: HTMLElement): void {
  assert(target.children.length === 0);
  const source = target.innerText;
  queue(
    target,
    target.tagName === 'SPAN'
      ? () => void cache.set(source, target.cloneNode(true))
      : undefined);
}

async function queue(target: HTMLElement, callback = () => undefined): Promise<void> {
  // @ts-ignore
  MathJax.typesetPromise || await MathJax.startup.promise;
  // @ts-ignore
  MathJax.typesetPromise([target]).then(callback);
}
