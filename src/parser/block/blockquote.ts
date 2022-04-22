import { BlockquoteParser } from '../block';
import { union, some, block, validate, rewrite, creator, open, convert, lazy, fmap } from '../../combinator';
import { autolink } from '../autolink';
import { contentline } from '../source';
import { parse } from '../api/parse';
import { html, defrag } from 'typed-dom/dom';

export const segment: BlockquoteParser.SegmentParser = block(validate(['!>', '>'], union([
  validate(/^!?>+(?=[^\S\n]|\n[^\S\n]*\S)/, some(contentline)),
])));

export const blockquote: BlockquoteParser = lazy(() => block(rewrite(segment, union([
  open(/^(?=>)/, source),
  open(/^!(?=>)/, markdown),
]))));

const opener = /^(?=>>+(?:$|\s))/;

const indent = block(open(opener, some(contentline, /^>(?:$|\s)/)), false);

function unindent(source: string): string {
  return source
    .replace(/\n$/, '')
    .replace(/^>(?:$|\s|(?=>+(?:$|\s)))/mg, '');
}

const source: BlockquoteParser.SourceParser = lazy(() => fmap(
  some(creator(union([
    rewrite(
      indent,
      convert(unindent, source)),
    rewrite(
      some(contentline, opener),
      convert(unindent, fmap(some(autolink), ns => [html('pre', defrag(ns))]))),
  ]))),
  ns => [html('blockquote', ns)]));

const markdown: BlockquoteParser.MarkdownParser = lazy(() => fmap(
  some(creator(union([
    rewrite(
      indent,
      convert(unindent, markdown)),
    creator(99,
    rewrite(
      some(contentline, opener),
      convert(unindent, (source, context) => {
        const annotations = html('ol', { class: 'annotations' });
        const references = html('ol', { class: 'references' });
        const document = parse(source, {
          id: '',
          footnotes: {
            annotations,
            references,
          },
        }, context);
        return [[html('section', [document, annotations, references])], ''];
      }))),
  ]))),
  ns => [html('blockquote', ns)]));
