import { BlockParser } from './block';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';

export function localize(block: BlockParser): BlockParser {
  return fmap(block, es => {
    for (let i = 0, len = es.length; i < len; ++i) {
      const bs = es[i].getElementsByClassName('linebreak');
      for (let i = 0, len = bs.length; i < len; ++i) {
        const el = bs[i];
        if (!el.firstChild || el.firstElementChild) continue;
        if (!check(el)) continue;
        assert(el.firstChild.textContent === ' ');
        el.firstChild.remove();
      }
    }
    return es;
  });
}

function check(el: Element): boolean {
  const char = lastChar(el.previousSibling);
  if (!char) return false;
  assert([...char].length === 1);
  return japanese(char);
}

function lastChar(node: Node | null | HTMLElement): string {
  while (node) {
    if ('id' in node && node.classList.contains('media')) return '';
    const str = text(node);
    if (str) return [...str.slice(-2)].pop() || '';
    node = node.previousSibling;
  }
  return '';
}

function text(node: Node | Text | HTMLElement): string {
  switch ('id' in node && node.tagName) {
    case 'RUBY':
      for (let ns = node.childNodes, i = ns.length; i--;) {
        const child = ns[i] as Node | Text | HTMLElement;
        switch ('id' in child && child.tagName) {
          case 'RT':
          case 'RP':
            continue;
          default:
            return 'wholeText' in child
              ? child.data
              : 'innerText' in child
                ? child.innerText
                : child.textContent!;
        }
      }
      return '';
    default:
      return 'wholeText' in node
        ? node.data
        : 'innerText' in node
          ? node.innerText
          : node.textContent!;
  }
}
