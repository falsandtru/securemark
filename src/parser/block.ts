import { MarkdownParser } from '../../markdown.d';
import { union } from '../combinator';
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
export import PretextParser = BlockParser.PretextParser;
export import MathParser = BlockParser.MathParser;
export import ExtensionParser = BlockParser.ExtensionParser;
export import ParagraphParser = BlockParser.ParagraphParser;
export import IndexerParser = BlockParser.IndexerParser;

export const block: BlockParser = union<BlockParser>([
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
