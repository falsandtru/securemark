import { ExtensionParser } from '../../block';
import { union, match, rewrite, eval, build } from '../../../combinator';
import { block } from '../../source/block';
import { parse } from '../../api/parse';
import { math } from '../math';
import { figure, footnote } from '../../../util';
import { suppress } from '../../../util/suppression';
import { html } from 'typed-dom';

export const segment: ExtensionParser.ExampleParser = block(build(() => segment_));

export const segment_: ExtensionParser.ExampleParser = block(match(
  /^(~{3,})example\/(?:markdown|math)[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]), false);

export const example: ExtensionParser.ExampleParser = block(rewrite(segment, union([
  match(
    /^(~{3,})example\/markdown[^\n]*(\n(?:[^\n]*\n)*?)\1\s*$/,
    ([, , body], rest) => {
      const view = html('div', [parse(body.slice(1, -1))]);
      const annotation = html('ol');
      const authority = html('ol');
      void figure(view);
      void footnote(view, { annotation, authority });
      void suppress(view);
      void suppress(annotation);
      void suppress(authority);
      return [[html('aside', { class: 'example', 'data-type': 'markdown' }, [
        html('pre', body.slice(1, -1)),
        view,
        annotation,
        authority,
      ])], rest];
    }),
  match(
    /^(~{3,})example\/math[^\n]*(\n(?:[^\n]*\n)*?)\1\s*$/,
    ([, , body], rest) =>
      [[html('aside', { class: 'example', 'data-type': 'math' }, [
        html('pre', body.slice(1, -1)),
        ...eval(math(`$$${body}$$`))
      ])], rest]),
])));
