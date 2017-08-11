export function code(target: HTMLElement): void {
  assert(target.children.length === 0);
  void Prism.highlightElement(target, false);
}
