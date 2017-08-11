export function code(source: HTMLElement): void {
  assert(source.children.length === 0);
  void Prism.highlightElement(source, false);
}
