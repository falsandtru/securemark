import { BlockParser } from './block';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';

export function localize(block: BlockParser): BlockParser {
  return fmap(block, es => {
    void es.forEach(el =>
      void el.querySelectorAll('.linebreak')
        .forEach(el => {
          if (el.childNodes.length === 1) return;
          assert(el.childNodes.length === 2);
          if (!check(el)) return;
          void el.removeChild(el.firstChild!);
        }));
    return es;
  });
}

function check(el: Element): boolean {
  const char = endingChar(el.previousSibling);
  return !!char
      && japanese(char);
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
  if (node instanceof Text) return node.wholeText;
  if (!(node instanceof Element)) return node.textContent!;
  switch (node.tagName.toLowerCase()) {
    case 'ruby':
      return [...node.childNodes]
        .reduceRight((str, node: Text | Element) => {
          if (str) return str;
          if (node instanceof Text) return node.wholeText;
          switch (node.tagName.toLowerCase()) {
            case 'rt':
            case 'rp':
              return '';
            default:
              return node.textContent!;
          }
        }, '');
    default:
      return node.textContent!;
  }
}
