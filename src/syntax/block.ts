import { Parser, Result } from '../parser.d';
import { MarkdownParser } from '../../markdown.d';
import { compose } from '../parser/compose';
import { newline } from './block/newline';
import { horizontalrule } from './block/horizontalrule';
import { header } from './block/header';
import { ulist } from './block/ulist';
import { olist } from './block/olist';
import { table } from './block/table';
import { blockquote } from './block/blockquote';
import { pretext } from './block/pretext';
import { paragraph } from './block/paragraph';

export import BlockParser = MarkdownParser.BlockParser;
export import NewlineParser = BlockParser.NewlineParser;
export import HorizontalRuleParser = BlockParser.HorizontalRuleParser;
export import HeaderParser = BlockParser.HeaderParser;
export import UListParser = BlockParser.UListParser;
export import OListParser = BlockParser.OListParser;
export import TableParser = BlockParser.TableParser;
export import BlockquoteParser = BlockParser.BlockquoteParser;
export import PreTextParser = BlockParser.PreTextParser;
export import ParagraphParser = BlockParser.ParagraphParser;

export const block: BlockParser = compose<[
  NewlineParser,
  HorizontalRuleParser,
  HeaderParser,
  UListParser,
  OListParser,
  TableParser,
  BlockquoteParser,
  PreTextParser,
  ParagraphParser
], HTMLElement>([
  newline,
  horizontalrule,
  header,
  ulist,
  olist,
  table,
  blockquote,
  pretext,
  paragraph
]);

const blockend = /^\s*?(?:\n|$)/;
export function consumeBlockEndEmptyLine<R, P extends Parser<any, any>[]>(rs: R[], rest: string): Result<R, P> {
  const [newline = void 0] = rest.match(blockend) || [];
  return newline === void 0
    ? void 0
    : [rs, rest.slice(newline.length)];
}
