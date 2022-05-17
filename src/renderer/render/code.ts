import Prism from 'prismjs';
import { Collection } from 'spica/collection';

export function code(target: HTMLElement, cache?: Collection<string, HTMLElement>): void {
  assert(target.children.length === 0);
  const source = target.textContent!;
  Prism.highlightElement(target, false, () =>
    void cache?.set(`${target.getAttribute('data-lang') ?? ''}\n${source}`, target.cloneNode(true)));
}
