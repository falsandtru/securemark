import { MarkdownParser } from '../../markdown';
import { Recursion, Command } from './context';
import { union, reset, open, fallback, recover } from '../combinator';
import { MAX_SEGMENT_SIZE } from './segment';
import { emptyline } from './source';
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

export const block: BlockParser = reset(
  {
    resources: {
      // バックトラックのせいで文字数制限を受けないようにする。
      clock: MAX_SEGMENT_SIZE * 5 + 1,
      recursions: [
        10 || Recursion.block,
        20 || Recursion.blockquote,
        40 || Recursion.listitem,
        20 || Recursion.inline,
        20 || Recursion.bracket,
        20 || Recursion.terminal,
      ],
    },
    backtracks: {},
  },
  error(union([
    input => {
      const { context: { source, position } } = input;
      if (position === source.length) return;
      const fst = source[position];
      switch (fst) {
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
          if (source[position + 1] === ' ') return ulist(input) || ilist(input);
          break;
        case '+':
        case '*':
          if (source[position + 1] === ' ') return ilist(input);
          break;
        case '[':
          switch (source[position + 1]) {
            case '$':
              return extension(input);
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
        case '#':
          return heading(input);
        case '$':
          if (source[position + 1] === '$') return mathblock(input);
          return extension(input);
        case '|':
          return table(input) || sidefence(input);
        case '(':
          return olist(input);
        default:
          if ('0' <= fst && fst <= '9') return olist(input);
      }
    },
    emptyline,
    paragraph
  ]) as any));

function error(parser: BlockParser): BlockParser {
  const reg = new RegExp(String.raw`^${Command.Error}.*\n`)
  return recover<BlockParser>(fallback(
    open(Command.Error, ({ context: { source, position } }) => { throw new Error(source.slice(position).split('\n', 1)[0]); }),
    parser),
    ({ context: { source, position, id } }, reason) => [[
      html('h1',
        {
          id: id !== '' ? `error:${rnd0Z(8)}` : undefined,
          class: 'error',
        },
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : `UnknownError: ${reason}`),
      html('pre',
        {
          class: 'error',
          translate: 'no',
        },
        source.slice(position)
          .replace(reg, '')
          .slice(0, 1001)
          .replace(/^(.{997}).{4}$/s, '$1...') || undefined),
    ]]);
}
