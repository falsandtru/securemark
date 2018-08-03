import { ExtensionParser } from '../../block';
import { union, match, rewrite, eval } from '../../../combinator';
import { block } from '../../source/block';
import { blockquote } from '../blockquote';
import { math } from '../math';
import { html } from 'typed-dom';

export const segment: ExtensionParser.ExampleParser = block(match(
  /^(~{3,})example\/(?:markdown|math)[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));

export const example: ExtensionParser.ExampleParser = block(rewrite(segment, union([
  match(
    /^(~{3,})example\/markdown[^\n]*(\n(?:[^\n]*\n)*?)\1\s*$/,
    ([, , body], rest) =>
      [[html('aside', { class: 'example', 'data-type': 'markdown' }, [
        html('pre', body.slice(1, -1)),
        html('div', ...eval(blockquote(`!${body.slice(1, -1).replace(/^/m, '> ')}`)).map(el => el.childNodes))
      ])], rest]),
  match(
    /^(~{3,})example\/math[^\n]*(\n(?:[^\n]*\n)*?)\1\s*$/,
    ([, , body], rest) =>
      [[html('aside', { class: 'example', 'data-type': 'math' }, [
        html('pre', body.slice(1, -1)),
        ...eval(math(`$$${body}$$`))
      ])], rest]),
])));
