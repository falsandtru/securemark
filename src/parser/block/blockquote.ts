import { BlockquoteParser } from '../block';
import { union, some, match } from '../../combinator';
import { block } from '../source/block';
import { firstline } from '../source/line';
import { unescsource } from '../source/unescapable';
import { parse } from '../parse';
import { stringify } from '../util';
import { html } from 'typed-dom';

const syntax = /^>+(?=\s|$)/;

export const blockquote: BlockquoteParser = block(match(/^\|?(?=(>+)(?:\s|$))/, ([flag, indent], source) => {
  const mode = flag ? 'markdown' : 'text';
  const top = html('blockquote');
  let bottom = indent.split('').slice(1)
    .reduce(p =>
      p.appendChild(html('blockquote'))
    , top);
  while (true) {
    if (firstline(source).trim() === '') break;
    const diff = (source.match(syntax) || [indent])[0].length - indent.length;
    if (diff > 0) {
      bottom = source.slice(0, diff).split('')
        .reduce(p =>
          p.appendChild(html('blockquote'))
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
      mode === 'text'
        ? void bottom.appendChild(html('br'))
        : bottom.lastChild.textContent += '\n';
    }
    source = source.split(/[^\S\n]/, 1)[0] === indent
      ? source.slice(indent.length + 1)
      : source.startsWith(`${indent}\n`)
        ? source.slice(indent.length)
        : source;
    const [cs = [], rest = source] = some<BlockquoteParser>(union([unescsource]), /^(?:\n|$)/)(source) || [];
    const text = mode === 'text'
      ? stringify(cs).replace(/ /g, String.fromCharCode(160))
      : stringify(cs);
    if (bottom.childNodes.length === 0 && text.trim() === '') return;
    void bottom.appendChild(document.createTextNode(text));
    source = rest.slice(1);
  }
  mode === 'markdown' && void expand(top);
  return [[top], source];
}));

function expand(el: HTMLQuoteElement): void {
  return void [...el.childNodes]
    .reduce<string[]>((ss, node) => {
      switch (true) {
        case node instanceof Text:
          const ref = node.nextSibling;
          void node.remove();
          void ss.push(node.textContent!);
          if (ref instanceof Text) return ss;
          void el.insertBefore(parse(ss.join('')), ref);
          return [];
        case node instanceof HTMLQuoteElement:
          assert.deepStrictEqual(ss, []);
          void expand(node as HTMLQuoteElement);
          return [];
        default:
          assert.deepStrictEqual(ss, []);
          return [];
      }
    }, []);
}
