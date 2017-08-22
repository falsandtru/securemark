import { highlightElement } from 'prismjs';

export function code(target: HTMLElement): void {
  assert(target.children.length === 0);
  void highlightElement(target, false);
}
