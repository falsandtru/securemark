export function context(
  base: DocumentFragment | HTMLElement | ShadowRoot,
  bound: string = 'id' in base && base.id
    ? `#${base.id}`
    : 'section, article, aside, blockquote',
): (el: Element) => boolean {
  const memory = new WeakMap<Node, boolean>();
  const context = 'id' in base && base.closest(bound) || null;
  return el => {
    assert(el.parentNode?.parentNode);
    const node = memory.has(el.parentNode!)
      ? el.parentNode!
      : el.parentNode!.parentNode!;
    return memory.get(node)
        || memory.set(node, el.closest(bound) === context).get(node)!;
  };
}
