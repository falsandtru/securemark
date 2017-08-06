import { MarkdownParser } from '../../markdown.d';

export import StringParser = MarkdownParser.TextParser;
export import TextParser = StringParser.TextParser;
export import PlainTextParser = StringParser.PlainTextParser;
export import MathTextParser = StringParser.MathTextParser;

export function squash(nodes: Node[] | NodeList): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (const curr of Array.from(nodes)) {
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
