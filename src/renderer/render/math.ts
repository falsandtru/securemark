import { undefined } from 'spica/global';
import { Collection } from 'spica/collection';
import { html, define } from 'typed-dom';

export function math(target: HTMLElement, cache?: Collection<string, HTMLElement>): void {
  assert(target.children.length === 0);
  const source = target.textContent!;
  queue(target, () => {
    !target.textContent?.trim() && define(target, [html('span', source)]);
    return void cache?.set(source, target.cloneNode(true));
  });
}

async function queue(target: HTMLElement, callback = () => undefined): Promise<void> {
  // @ts-ignore
  MathJax.typesetPromise || await MathJax.startup.promise;
  // @ts-ignore
  MathJax.typesetPromise([target]).then(callback);
}
