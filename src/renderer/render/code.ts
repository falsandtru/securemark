import * as Prism from 'prismjs';
import { Cache } from 'spica/cache';

export function code(target: HTMLElement, cache?: Cache<string, HTMLElement>): void {
  assert(target.children.length === 0);
  const source = target.textContent!;
  Prism.highlightElement(target, false, () =>
    void cache?.set(`${target.getAttribute('data-lang') || ''}\n${source}`, target.cloneNode(true)));
}
