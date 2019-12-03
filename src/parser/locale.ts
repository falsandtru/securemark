import { BlockParser } from './block';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';
import { html } from 'typed-dom';

export function localize(block: BlockParser): BlockParser {
  return fmap(block, es => {
    for (const block of es) {
      for (const el of block.getElementsByClassName('linebreak')) {
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

function text(node: Node): string {
  switch (node.nodeType) {
    case 3:
      return node.textContent!;
    case 1:
      switch ((node as HTMLElement).tagName) {
        case 'RUBY':
          for (let i = node.childNodes.length - 1; i >= 0; --i) {
            const child = node.childNodes[i];
            if (child.nodeType === 3) return child.textContent!;
            switch ((child as HTMLElement).tagName) {
              case 'RT':
              case 'RP':
                break;
              default:
                return child.textContent!;
            }
          }
          return '';
        default:
          return node.textContent!;
      }
    default:
      return node.textContent!;
  }
}
