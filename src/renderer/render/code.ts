export function code(source: HTMLElement): void {
  if (source.children.length > 0) return;
  void Prism.highlightElement(source, false);
}
