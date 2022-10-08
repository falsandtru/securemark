export function scope(
  base: DocumentFragment | HTMLElement | ShadowRoot,
  filter: string = '',
  bound: string = `${'id' in base && base.id ? `#${base.id}, ` : ''}section, article, aside, blockquote, pre, .quote, .math, .media`,
): (el: Element) => boolean {
  bound += filter && `, ${filter}`;
  const memory = new WeakMap<Node, boolean>();
  const context = 'id' in base && base.closest(bound) || null;
  return el => {
    assert(el.parentNode?.parentNode);
    const { parentNode } = el;
    const node = memory.has(parentNode!)
      ? parentNode!
      : parentNode!.parentNode!;
    let result = memory.get(node);
    if (result === undefined) {
      result = el.closest(bound) === context;
      memory.set(node, result);
    }
    return result;
  };
}
