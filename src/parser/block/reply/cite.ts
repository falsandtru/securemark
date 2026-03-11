import { ReplyParser } from '../../block';
import { List, Node } from '../../../combinator/data/parser';
import { Flag } from '../../node';
import { union, line, focus, open, fmap } from '../../../combinator';
import { anchor } from '../../inline/autolink/anchor';
import { str } from '../../source';
import { invalid } from '../../util';
import { html, define, defrag } from 'typed-dom/dom';

export const syntax = />*(?=>>[^>\s]\S*[^\S\n]*(?:$|\n))/y;

export const cite: ReplyParser.CiteParser = line(fmap(
  open(
    str(syntax),
    union([
      line(anchor),
      // Subject page representation.
      // リンクの実装は後で検討
      focus(/>>#\S*(?=\s*$)/y, ({ context: { source } }) => new List([new Node(html('a', { class: 'anchor' }, source))])),
      focus(/>>https?:\/\/\S+(?=\s*$)/y, ({ context: { source } }) => new List([new Node(html('a', { class: 'anchor', href: source.slice(2).trimEnd(), target: '_blank' }, source))])),
      focus(/>>\S+(?=\s*$)/y, ({ context: { source } }) => new List([new Node(source)])),
    ])),
  nodes => {
    const quotes = nodes.head!.value as string;
    const node = nodes.last!.value;
    return new List([
      new Node(html('span',
        typeof node === 'object'
          ? { class: 'cite' }
          : { class: 'cite invalid', ...invalid('cite', 'syntax', 'Invalid syntax') },
        defrag([
          `${quotes}>`,
          typeof node === 'object'
            ? define(node, { 'data-depth': `${quotes.length + 1}` }, node.innerText.slice(1))
            : node.slice(1),
        ]))),
      new Node(html('br'), Flag.invisible),
    ]);
  }));
