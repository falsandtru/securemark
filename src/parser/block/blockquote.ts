import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { BlockquoteParser, consumeBlockEndEmptyLine } from '../block';
import { BlockParser, block } from '../block';
import { PlainTextParser, squash } from '../text';
import { plaintext } from '../text/plaintext';

type SubParsers = [PlainTextParser] | [BlockParser];

const syntax = /^>+(?=[ \n]|$)/;

export const blockquote: BlockquoteParser = function (source: string): Result<HTMLQuoteElement, SubParsers> {
  const mode = source.startsWith('|>')
    ? 'markdown'
    : 'plain';
  source = mode === 'markdown'
    ? source.slice(1)
    : source;
  let [indent] = source.match(syntax) || [''];
  if (!indent) return;
  const top = document.createElement('blockquote');
  let bottom = indent.split('').slice(1)
    .reduce(p =>
      p.appendChild(document.createElement('blockquote'))
    , top);
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    const diff = (line.match(syntax) || [indent])[0].length - indent.length;
    if (diff > 0) {
      bottom = line.slice(0, diff).split('')
        .reduce(p =>
          p.appendChild(document.createElement('blockquote'))
        , bottom);
    }
    if (diff < 0) {
      bottom = line.slice(0, -diff).split('')
        .reduce(p =>
          <HTMLQuoteElement>p.parentElement!
        , bottom);
    }
    assert(indent.length + diff > 0);
    indent = indent[0].repeat(indent.length + diff);
    if (bottom.lastChild instanceof Text) {
      const node = mode === 'plain'
        ? document.createElement('br')
        : document.createTextNode('\n');
      void bottom.appendChild(node);
    }
    const text = line.split(' ', 1)[0] === indent
      ? line.slice(indent.length + 1)
      : line;
    const node = mode === 'plain'
      ? squash((loop(combine<SubParsers, HTMLElement | Text>([plaintext]))(text.replace(/ /g, String.fromCharCode(160))) || [[document.createTextNode('')]])[0])
      : document.createTextNode(text);
    if (bottom.childNodes.length === 0 && node.textContent!.trim() === '') return;
    void bottom.appendChild(node);
    source = source.slice(line.length + 1);
  }
  if (mode === 'markdown') {
    void expand(top);
  }
  return consumeBlockEndEmptyLine<HTMLQuoteElement, SubParsers>([top], source);
};

function expand(el: HTMLQuoteElement): void {
  return void Array.from(el.childNodes)
    .reduce<string[]>((ss, node) => {
      assert(node instanceof Text || node instanceof HTMLQuoteElement);
      if (node instanceof HTMLQuoteElement) {
        void expand(node);
        return [];
      }
      else {
        void ss.push(node.textContent!);
        const ref = node.nextSibling;
        void el.removeChild(node);
        if (ref instanceof Text) return ss;
        void el.insertBefore(parse(ss.join('')), ref);
        return [];
      }
    }, []);

  function parse(source: string): DocumentFragment {
    return (loop(block)(source) || [<HTMLElement[]>[]])[0]
      .reduce((frag, node) => (
        frag.appendChild(node),
        frag
      ), document.createDocumentFragment());
  }
}
