import { Result } from '../../parser';
import { TextParser } from '../inline';

const separator = /[!~^+*`<>\[\]\(\)\|\s\n\\]/;

export const text: TextParser = function (source: string): Result<HTMLElement | Text, never> {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[document.createTextNode(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\n':
              return [[document.createElement('br')], source.slice(2)];
            default:
              return [[document.createTextNode(source.slice(1, 2))], source.slice(2)];
          }
        case '\n':
          return [[], source.slice(1)];
        default:
          return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[document.createTextNode(source.slice(0, i))], source.slice(i)];
  }
};

export function squash<N extends HTMLElement | Text>(nodes: N[]): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (const curr of nodes) {
    const prev = frag.lastChild;
    if (prev && prev.nodeType === 3 && curr.nodeType === 3) {
      prev.textContent += curr.textContent!;
      curr.textContent = '';
    }
    else {
      void frag.appendChild(curr);
    }
  }
  return frag;
}
