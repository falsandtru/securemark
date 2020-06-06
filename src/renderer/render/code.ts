import * as Prism from 'prismjs';

export function code(target: HTMLElement): void {
  assert(target.children.length === 0);
  requestAnimationFrame(() => Prism.highlightElement(target, false));
}
