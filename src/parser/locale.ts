import { BlockParser } from './block';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';
import { html } from 'typed-dom';

export function localize(block: BlockParser): BlockParser {
  return fmap(block, es => {
    for (let i = 0, len = es.length; i < len; ++i) {
      const bs = es[i].getElementsByClassName('linebreak');
      for (let i = 0, len = bs.length; i < len; ++i) {
        const el = bs[i];
        if (!el.firstChild || el.firstElementChild) continue;
        if (!check(el)) continue;
        assert(el.firstChild.textContent === ' ');
        void el.replaceChild(html('wbr'), el.firstChild);
      }
    }
    return es;
  });
}

function check(el: Element): boolean {
  const char = endingChar(el.previousSibling);
  if (!char) return false;
  assert([...char].length === 1);
  return japanese(char);
}

function endingChar(node: Node | null): string {
  while (node) {
    const str = text(node);
    if (str) return [...str.slice(-2)].pop() || '';
    node = node.previousSibling;
  }
  return '';
}

function text(node: Node | Text): string {
  switch (node.nodeName) {
    case 'RUBY':
      for (let i = node.childNodes.length; i--;) {
        const child = node.childNodes[i];
        switch (child.nodeName) {
          case 'RT':
          case 'RP':
            break;
          default:
            return child.textContent!;
        }
      }
      return '';
    default:
      return 'data' in node
        ? node.data
        : node.textContent!;
  }
}
