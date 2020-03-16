import { MarkdownParser } from '../../markdown.d';
import { union, update, recover } from '../combinator';
import { emptyline } from './source/line';
import { horizontalrule } from './block/horizontalrule';
import { heading } from './block/heading';
import { ulist } from './block/ulist';
import { olist } from './block/olist';
import { ilist } from './block/ilist';
import { dlist } from './block/dlist';
import { table } from './block/table';
import { blockquote } from './block/blockquote';
import { codeblock } from './block/codeblock';
import { mathblock } from './block/mathblock';
import { extension } from './block/extension';
import { paragraph } from './block/paragraph';
import { localize } from './locale';
import { html } from 'typed-dom';

export import BlockParser = MarkdownParser.BlockParser;
export import HorizontalRuleParser = BlockParser.HorizontalRuleParser;
export import HeadingParser = BlockParser.HeadingParser;
export import UListParser = BlockParser.UListParser;
export import OListParser = BlockParser.OListParser;
export import IListParser = BlockParser.IListParser;
export import DListParser = BlockParser.DListParser;
export import TableParser = BlockParser.TableParser;
export import CodeBlockParser = BlockParser.CodeBlockParser;
export import MathBlockParser = BlockParser.MathBlockParser;
export import ExtensionParser = BlockParser.ExtensionParser;
export import BlockquoteParser = BlockParser.BlockquoteParser;
export import ParagraphParser = BlockParser.ParagraphParser;

export const block: BlockParser = recover(localize(
  update({ resources: { creation: 100 * 1000 } },
  union([
    emptyline,
    horizontalrule,
    heading,
    ulist,
    olist,
    ilist,
    dlist,
    table,
    codeblock,
    mathblock,
    extension,
    blockquote,
    paragraph
  ]))),
  (_, __, reason) => [
    [html('h1',
      { class: 'invalid' },
      reason instanceof Error
        ? `${reason.name}: ${reason.message}`
        : `Unknown error: ${reason}`)],
    ''
  ]);
