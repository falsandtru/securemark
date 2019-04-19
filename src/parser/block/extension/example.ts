import { ExtensionParser } from '../../block';
import { union, block, rewrite, focus, match, trim, lazy, eval } from '../../../combinator';
import { parse } from '../../api/parse';
import { mathblock } from '../mathblock';
import { suppress } from '../../util';
import { figure, footnote } from '../../../util';
import { html } from 'typed-dom';

export const segment: ExtensionParser.ExampleParser.SegmentParser = lazy(() => block(segment_));

export const segment_: ExtensionParser.ExampleParser.SegmentParser = block(focus(
  /^(~{3,})example\/(?:markdown|math)[^\S\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,100}\1[^\S\n]*(?:\n|$)/,
  _ => [[], '']), false);

export const example: ExtensionParser.ExampleParser = block(rewrite(segment, trim(union([
  match(
    /^(~{3,})example\/markdown[^\S\n]*(\n[\s\S]*)\1$/,
    ([, , body]) => rest => {
      const view = html('div', [parse(body.slice(1, -1))]);
      const annotation = html('ol');
      const authority = html('ol');
      void figure(view);
      void footnote(view, { annotation, authority });
      return [[html('aside', { class: 'example', 'data-type': 'markdown' }, [
        html('pre', body.slice(1, -1)),
        suppress(view),
        suppress(annotation),
        suppress(authority),
      ])], rest];
    }),
  match(
    /^(~{3,})example\/math[^\S\n]*(\n[\s\S]*)\1$/,
    ([, , body]) => rest =>
      [[html('aside', { class: 'example', 'data-type': 'math' }, [
        html('pre', body.slice(1, -1)),
        ...eval(mathblock(`$$${body}$$`))
      ])], rest]),
]))));
