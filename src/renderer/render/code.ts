import Prism from 'prismjs';
import { Dict } from 'spica/dict';

export function code(target: HTMLElement, cache?: Dict<string, HTMLElement>): void {
  assert(target.children.length === 0);
  const source = target.textContent!;
  Prism.highlightElement(target, false, () =>
    void cache?.set(`${target.getAttribute('data-lang') ?? ''}\n${source}`, target.cloneNode(true)));
}
