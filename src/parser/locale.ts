import { BlockParser } from './block';
import { fmap } from '../combinator';
import { japanese } from './locale/ja';

export function localize(block: BlockParser): BlockParser {
  return fmap(block, es => {
    void es.forEach(el =>
      void el.querySelectorAll('.linebreak')
        .forEach(el => {
          assert(el.childNodes.length === 1);
          if (!check(el)) return;
          void el.removeChild(el.firstChild!);
        }));
    return es;
  });
}

function check(el: Element): boolean {
  const char = endingChar(prevText(el));
  if (!char) return false;
  return japanese(char);
}

function endingChar(str: string): string {
  return [...str.slice(-2)].pop() || '';
}

function prevText(el: Element): string {
  return el.previousSibling
    ? text(el.previousSibling)
    : '';
}

function text(node: Node): string {
  if (!(node instanceof Element)) return node.textContent!;
  switch (node.tagName.toLowerCase()) {
    case 'ruby':
      return [...node.childNodes]
        .reduceRight((str, node: Text | Element) => {
          if (str) return str;
          if (node instanceof Text) return node.textContent!;
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
