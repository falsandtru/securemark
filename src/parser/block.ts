import { Parser, Result } from '../combinator/parser';
import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator/combine';
import { newline } from './block/newline';
import { horizontalrule } from './block/horizontalrule';
import { heading } from './block/heading';
import { ulist } from './block/ulist';
import { olist } from './block/olist';
import { dlist } from './block/dlist';
import { table } from './block/table';
import { blockquote } from './block/blockquote';
import { pretext } from './block/pretext';
import { math } from './block/math';
import { extension } from './block/extension';
import { paragraph } from './block/paragraph';

export import BlockParser = MarkdownParser.BlockParser;
export import NewlineParser = BlockParser.NewlineParser;
export import HorizontalRuleParser = BlockParser.HorizontalRuleParser;
export import HeadingParser = BlockParser.HeadingParser;
export import UListParser = BlockParser.UListParser;
export import OListParser = BlockParser.OListParser;
export import DListParser = BlockParser.DListParser;
export import TableParser = BlockParser.TableParser;
export import BlockquoteParser = BlockParser.BlockquoteParser;
export import PreTextParser = BlockParser.PreTextParser;
export import MathBlockParser = BlockParser.MathBlockParser;
export import ExtensionParser = BlockParser.ExtensionParser;
export import ParagraphParser = BlockParser.ParagraphParser;
export import IndexerParser = BlockParser.IndexerParser;

export const block: BlockParser = combine<[
  NewlineParser,
  HorizontalRuleParser,
  HeadingParser,
  UListParser,
  OListParser,
  DListParser,
  TableParser,
  BlockquoteParser,
  PreTextParser,
  MathBlockParser,
  ExtensionParser,
  ParagraphParser
], HTMLElement>([
  newline,
  horizontalrule,
  heading,
  ulist,
  olist,
  dlist,
  table,
  blockquote,
  pretext,
  math,
  extension,
  paragraph
]);

const blockend = /^[^\S\n]*(?:\n|$)/;
export function consumeBlockEndEmptyLine<R, P extends Parser<any, any>[]>(rs: R[], rest: string): Result<R, P> {
  const [newline = void 0] = rest.match(blockend) || [];
  return newline === void 0
    ? void 0
    : [rs, rest.slice(newline.length)];
}
