import { MarkdownParser } from '../../markdown';
import { Segment, Command } from './context';
import { List, Node } from '../combinator/data/parser';
import { union, firstline, recover } from '../combinator';
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

export const block: BlockParser = error(union([
  emptysegment,
  input => {
    const { source, position, segment } = input;
    if (position === source.length) return;
    switch (segment ^ Segment.write) {
      case Segment.heading:
        return heading(input);
      case Segment.fig:
        return fig(input);
      case Segment.figure:
        return figure(input);
    }
    const char = source[position];
    switch (char) {
      case Command.Error:
        throw new Error(firstline(source, position + 1).trimEnd());
      case '=':
        if (source.startsWith('===', position)) return pagebreak(input);
        break;
      case '`':
        if (source.startsWith('```', position)) return codeblock(input);
        break;
      case '~':
        if (source.startsWith('~~~', position)) return extension(input);
        if (source[position + 1] === ' ') return dlist(input);
        break;
      case '-':
        if (source.startsWith('---', position)) return header(input);
        if (source[position + 1] === ' ') return ulist(input) || ilist(input);
        break;
      case '+':
      case '*':
        if (source[position + 1] === ' ') return ilist(input);
        break;
      case '[':
        switch (source[position + 1]) {
          case '$':
            return figbase(input);
          case '!':
            return mediablock(input);
        }
        break;
      case '!':
        if (source[position + 1] === '>') return blockquote(input);
        return mediablock(input);
      case '>':
        if (source[position + 1] === '>') return blockquote(input) || reply(input);
        return blockquote(input);
      case '$':
        if (source[position + 1] === '$') return mathblock(input);
        return figbase(input);
      case '|':
        return table(input) || sidefence(input);
      case '(':
        return olist(input);
      default:
        if ('0' <= char && char <= '9') return olist(input);
    }
  },
  paragraph
]));

function error(parser: BlockParser): BlockParser {
  const reg = new RegExp(String.raw`^${Command.Error}[^\r\n]*\r?\n`)
  return recover<BlockParser>(
    parser,
    ({ source, position, id }, reason) => new List([
      new Node(html('h1',
        {
          id: id !== '' ? `error:${rnd0Z(8)}` : undefined,
          class: 'error',
        },
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : `UnknownError: ${reason}`)),
      new Node(html('pre',
        {
          class: 'error',
          translate: 'no',
        },
        source.slice(position)
          .replace(reg, '')
          .slice(0, 1001)
          .replace(/^(.{997}).{4}$/s, '$1...') || undefined)),
    ]));
}
