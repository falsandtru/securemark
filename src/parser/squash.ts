export function squash<T extends Node[]>(nodes: T): T;
export function squash<T extends Node[], U extends DocumentFragment>(nodes: T, container: U): U;
export function squash<T extends Node[], U extends T | Node>(nodes: T, container: U = [] as Node[] as U): U {
  const enum Types {
    Array,
    Node,
  }
  const obj = Array.isArray(container)
    ? { type: Types.Array as Types.Array, value: container as T, }
    : { type: Types.Node as Types.Node, value: container as Node, };
  void nodes
    .reduce<Node | undefined>((prev, curr) => {
      if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
        prev.textContent += curr.textContent!;
        curr.textContent = '';
        return prev;
      }
      switch (obj.type) {
        case Types.Array:
          void obj.value.push(curr);
          break;
        case Types.Node:
          void obj.value.appendChild(curr);
          break;
      }
      return curr;
    }, undefined);
  return container;
}
