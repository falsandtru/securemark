import { ReplyParser } from '../../block';
import { union, line, validate, focus, open, fmap } from '../../../combinator';
import { anchor } from '../../inline/autolink/anchor';
import { str } from '../../source';
import { html, define, defrag } from 'typed-dom/dom';

export const syntax = /^>*(?=>>[^>\s]\S*[^\S\n]*(?:$|\n))/;

export const cite: ReplyParser.CiteParser = line(fmap(validate(
  '>>',
  open(
    str(syntax),
    union([
      anchor,
      // Subject page representation.
      // リンクの実装は後で検討
      focus(/^>>#\S*(?=\s*$)/, ({ source }) => [[html('a', { class: 'anchor' }, source)], ''], false),
      focus(/^>>https?:\/\/\S+(?=\s*$)/, ({ source }) => [[html('a', { class: 'anchor', href: source.slice(2).trimEnd(), target: '_blank' }, source)], ''], false),
      focus(/^>>.+(?=\s*$)/, ({ source }) => [[source], ''], false),
    ]),
  )),
  ([quotes, node]: [string, HTMLElement | string]) => [
    html('span',
      typeof node === 'object'
        ? { class: 'cite' }
        : {
            class: 'cite invalid',
            'data-invalid-syntax': 'cite',
            'data-invalid-type': 'syntax',
            'data-invalid-message': 'Invalid syntax',
          },
      defrag([
        `${quotes}>`,
        typeof node === 'object'
          ? define(node, { 'data-depth': `${quotes.length + 1}` }, node.innerText.slice(1))
          : node.slice(1),
      ])),
    html('br'),
  ]));
