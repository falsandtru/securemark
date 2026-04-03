import { MarkdownParser } from '../../markdown';
import { Segment } from './context';
import { List, Node } from '../combinator/parser';
import { union, lazy, always } from '../combinator';
import { header } from './header';
import { emptysegment } from './source';
import { pagebreak } from './block/pagebreak';
import { heading } from './block/heading';
import { ulist } from './block/ulist';
import { olist } from './block/olist';
import { ilist } from './block/ilist';
import { dlist } from './block/dlist';
import { table } from './block/table';
import { codeblock } from './block/codeblock';
import { mathblock } from './block/mathblock';
import { extension } from './block/extension';
import { figbase } from './block/extension/figbase';
import { fig } from './block/extension/fig';
import { figure } from './block/extension/figure';
import { sidefence } from './block/sidefence';
import { blockquote } from './block/blockquote';
import { mediablock } from './block/mediablock';
import { reply } from './block/reply';
import { paragraph } from './block/paragraph';
import { rnd0Z } from 'spica/random';
import { html } from 'typed-dom/dom';

export import BlockParser = MarkdownParser.BlockParser;
export import PagebreakParser = BlockParser.PagebreakParser;
export import HeadingParser = BlockParser.HeadingParser;
export import UListParser = BlockParser.UListParser;
export import OListParser = BlockParser.OListParser;
export import IListParser = BlockParser.IListParser;
export import DListParser = BlockParser.DListParser;
export import TableParser = BlockParser.TableParser;
export import CodeBlockParser = BlockParser.CodeBlockParser;
export import MathBlockParser = BlockParser.MathBlockParser;
export import ExtensionParser = BlockParser.ExtensionParser;
export import SidefenceParser = BlockParser.SidefenceParser;
export import BlockquoteParser = BlockParser.BlockquoteParser;
export import MediaBlockParser = BlockParser.MediaBlockParser;
export import ReplyParser = BlockParser.ReplyParser;
export import ParagraphParser = BlockParser.ParagraphParser;

const p1 = lazy(() => union([
  ulist,
  ilist,
]));
const p2 = lazy(() => union([
  blockquote,
  reply,
]));
const p3 = lazy(() => union([
  table,
  sidefence,
]));
export const block: BlockParser = lazy(() => error(union([
  emptysegment,
  (input, output) => {
    const { source, position, segment } = input;
    if (position === source.length) return;
    switch (segment & ~Segment.write) {
      case Segment.heading:
        return heading(input, output);
      case Segment.fig:
        return fig(input, output);
      case Segment.figure:
        return figure(input, output);
    }
    const char = source[position];
    switch (char) {
      case '=':
        if (source.startsWith('===', position)) return pagebreak(input, output);
        break;
      case '`':
        if (source.startsWith('```', position)) return codeblock(input, output);
        break;
      case '~':
        if (source.startsWith('~~~', position)) return extension(input, output);
        if (source[position + 1] === ' ') return dlist(input, output);
        break;
      case '-':
        if (source.startsWith('---', position)) return header(input, output);
        if (source[position + 1] === ' ') return p1(input, output);
        break;
      case '+':
      case '*':
        if (source[position + 1] === ' ') return ilist(input, output);
        break;
      case '[':
        switch (source[position + 1]) {
          case '$':
            return figbase(input, output);
          case '!':
            return mediablock(input, output);
        }
        break;
      case '!':
        if (source[position + 1] === '>') return blockquote(input, output);
        return mediablock(input, output);
      case '>':
        if (source[position + 1] === '>') return p2(input, output);
        return blockquote(input, output);
      case '$':
        if (source[position + 1] === '$') return mathblock(input, output);
        return figbase(input, output);
      case '|':
        return p3(input, output);
      case '(':
        return olist(input, output);
      default:
        if (char <= '9' && '0' <= char) return olist(input, output);
    }
  },
  paragraph
])));

function error(parser: BlockParser): BlockParser {
  return always([
    parser,
    ({ source, position, id }, output) => {
      const { error } = output;
      if (!error) return output.context;
      output.error = undefined;
      return output.import(new List([
        new Node(html('h1',
          {
            id: id !== '' ? `error:${rnd0Z(8)}` : undefined,
            class: 'error',
          },
          `${error.name}: ${error.message}`)),
        new Node(html('pre',
          {
            class: 'error',
            translate: 'no',
          },
          source.slice(position)
            .slice(0, 1001)
            .replace(/^(.{997}).{4}$/s, '$1...') || undefined)),
      ]));
    },
  ]);
}
