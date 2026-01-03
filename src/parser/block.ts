import { MarkdownParser } from '../../markdown';
import { union, reset, open, fallback, recover } from '../combinator';
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
import { Recursion } from './context';
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
      clock: 20000,
      recursions: [
        10 || Recursion.block,
        20 || Recursion.blockquote,
        40 || Recursion.listitem,
        20 || Recursion.inline,
        20 || Recursion.bracket,
        20 || Recursion.terminal,
      ],
    },
  },
  error(union([
    emptyline,
    pagebreak,
    heading,
    ulist,
    olist,
    ilist,
    dlist,
    table,
    codeblock,
    mathblock,
    extension,
    sidefence,
    blockquote,
    mediablock,
    reply,
    paragraph
  ])));

function error(parser: BlockParser): BlockParser {
  return recover<BlockParser>(fallback(
    open('\x07', ({source}) => { throw new Error(source.split('\n', 1)[0]); }),
    parser),
    ({ source, context: { id } }, reason) => [[
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
        source
          .replace(/^\x07.*\n/, '')
          .slice(0, 1001)
          .replace(/^(.{997}).{4}$/s, '$1...') || undefined),
    ], '']);
}
