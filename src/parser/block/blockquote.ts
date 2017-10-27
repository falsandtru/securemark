import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { BlockquoteParser } from '../block';
import { verifyBlockEnd } from './end';
import { BlockParser, block } from '../block';
import { UnescapableSourceParser } from '../source';
import { unescsource } from '../source/unescapable';
import { squash } from '../squash';

type SubParsers = [UnescapableSourceParser] | [BlockParser];

const syntax = /^>+(?=\s|$)/;

export const blockquote: BlockquoteParser = verifyBlockEnd(function (source: string): Result<HTMLQuoteElement, SubParsers> {
  const mode = undefined
    || source.startsWith('>') && 'plain'
    || source.startsWith('|>') && 'markdown'
    || '';
  if (mode === '') return;
  source = mode === 'plain'
    ? source
    : source.slice(1);
  let [indent] = source.match(syntax) || [''];
  if (!indent) return;
  const top = document.createElement('blockquote');
  let bottom = indent.split('').slice(1)
    .reduce(p =>
      p.appendChild(document.createElement('blockquote'))
    , top);
  while (true) {
    if (source.split('\n', 1).shift()!.trim() === '') break;
    const diff = (source.match(syntax) || [indent])[0].length - indent.length;
    if (diff > 0) {
      bottom = source.slice(0, diff).split('')
        .reduce(p =>
          p.appendChild(document.createElement('blockquote'))
        , bottom);
    }
    if (diff < 0) {
      bottom = source.slice(0, -diff).split('')
        .reduce(p =>
          p.parentElement! as HTMLQuoteElement
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
    source = source.split(/[^\S\n]/, 1).shift()! === indent
      ? source.slice(indent.length + 1)
      : source.startsWith(`${indent}\n`)
        ? source.slice(indent.length)
        : source;
    const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([unescsource]), '\n|$')(source) || [[document.createTextNode('')], source];
    const node = mode === 'plain'
      ? document.createTextNode(squash(cs).textContent!.replace(/ /g, String.fromCharCode(160)))
      : squash(cs);
    if (bottom.childNodes.length === 0 && node.textContent!.trim() === '') return;
    void bottom.appendChild(node);
    source = rest.slice(1);
  }
  if (mode === 'markdown') {
    void expand(top);
  }
  return [[top], source];
});

function expand(el: HTMLQuoteElement): void {
  return void [...el.childNodes]
    .reduce<string[]>((ss, node) => {
      switch (true) {
        case node instanceof Text:
          void ss.push(node.textContent!);
          const ref = node.nextSibling;
          void el.removeChild(node);
          if (ref instanceof Text) return ss;
          void el.insertBefore(parse(ss.join('')), ref);
          return [];
        case node instanceof HTMLQuoteElement:
          void expand(node as HTMLQuoteElement);
          return [];
        default:
          void el.insertBefore(node, node.nextSibling);
          return [];
      }
    }, []);

  function parse(source: string): DocumentFragment {
    return (loop(block)(source) || [[] as HTMLElement[]])[0]
      .reduce((frag, node) => (
        frag.appendChild(node),
        frag
      ), document.createDocumentFragment());
  }
}
