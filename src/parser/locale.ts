import { BlockParser } from './block';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';

const memory = new WeakSet<Element>();

export function localize(block: BlockParser): BlockParser {
  return fmap(block, es => {
    for (let i = 0, len = es.length; i < len; ++i) {
      const bs = es[i].getElementsByClassName('linebreak');
      for (let i = 0, len = bs.length; i < len; ++i) {
        const el = bs[i];
        if (memory.has(el)) continue;
        memory.add(el);
        if (!el.firstChild) continue;
        if (!check(el)) continue;
        assert(el.firstChild.textContent === ' ');
        el.firstChild.remove();
      }
    }
    return es;
  });
}

function check(el: Element): boolean {
  const char = lastChar(el);
  if (!char) return false;
  assert([...char].length === 1);
  return japanese(char);
}

function lastChar(node: Element | Text | null): string {
  while (node = node?.previousSibling as typeof node) {
    if ('id' in node && !node.firstChild) {
      switch (node.tagName) {
        case 'BR':
          return '';
        case 'SPAN':
          if (node.className === 'linebreak') return '';
      }
      continue;
    }
    const str = text(node);
    return str && [...str.slice(-2)].pop()!;
  }
  return '';
}

function text(node: Text | Element): string {
  if (!('id' in node)) return node.data;
  switch (node.tagName) {
    case 'RUBY':
      for (let ns = node.childNodes, i = ns.length; i--;) {
        const child = ns[i] as Text | Element;
        if ('id' in child) continue;
        return child.data;
      }
      assert(false);
      return '';
    default:
      return node.textContent!;
  }
}
