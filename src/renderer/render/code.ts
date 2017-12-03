import * as Prism from 'prismjs';

export function code(target: HTMLElement): void {
  assert(target.children.length === 0);
  void requestAnimationFrame(() => void Prism.highlightElement(target, false));
}
