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
    ? 'block'
    : 'plain';
  source = mode === 'block'
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
    if (bottom.lastChild && bottom.lastChild !== bottom.lastElementChild) {
      void bottom.appendChild(document.createElement('br'));
    }
    const text = line
      .slice(line.split(' ', 1)[0] === indent ? indent.length + 1 : 0)
      .replace(mode === 'plain' ? / /g : /$^/, String.fromCharCode(160));
    void bottom.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([plaintext]))(text) || [[document.createTextNode('')]])[0]));
    if (bottom.childNodes.length === 1 && bottom.firstChild!.textContent!.trim() === '') return;
    source = source.slice(line.length + 1);
  }
  if (mode === 'block') {
    void expand(top);
  }
  return consumeBlockEndEmptyLine<HTMLQuoteElement, SubParsers>([top], source);
};

function expand(el: HTMLQuoteElement): void {
  return void Array.from(el.childNodes)
    .reduce<string[]>((ss, node) => {
      if (node instanceof Text) {
        void ss.push(node.textContent!);
      }
      if (node instanceof HTMLBRElement) {
        void ss.push('\n');
      }
      if (node instanceof HTMLQuoteElement) {
        void el.insertBefore(parse(ss.splice(0, Infinity).join('')), node);
        void expand(node);
      }
      if (!node.nextSibling) {
        void el.insertBefore(parse(ss.splice(0, Infinity).join('')), node);
      }
      if (node instanceof HTMLQuoteElement) return ss;
      void el.removeChild(node);
      return ss;
    }, []);

  function parse(source: string): DocumentFragment {
    return (loop(block)(source) || [<HTMLElement[]>[]])[0]
      .reduce((frag, node) => (
        frag.appendChild(node),
        frag
      ), document.createDocumentFragment());
  }
}
