import { undefined } from 'spica/global';
import { cache } from '../../parser/inline/math';

export function math(target: HTMLElement): void {
  assert(target.children.length === 0);
  const source = target.innerText;
  queue(target, () => void cache.set(source, target.cloneNode(true)));
}

async function queue(target: HTMLElement, callback = () => undefined): Promise<void> {
  // @ts-ignore
  MathJax.typesetPromise || await MathJax.startup.promise;
  // @ts-ignore
  MathJax.typesetPromise([target]).then(callback);
}
