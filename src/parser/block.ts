import { undefined } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { union, update, creator, recover } from '../combinator';
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
import { rnd0Z } from 'spica/random';
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

export const block: BlockParser = creator(error(localize(
  update({ resources: { budget: 100 * 1000 } },
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
  ])))));

export function error(parser: MarkdownParser.BlockParser): MarkdownParser.BlockParser {
  return recover((source, context) =>
    source[0] === '\0'
      ? (() => { throw new Error(source.slice(1, 1000).split('\n', 1)[0]); })()
      : parser(source, context),
    (source, { id }, reason) => [[
      html('h1',
        {
          id: id !== '' ? `error:${rnd0Z(8)}` : undefined,
          class: 'error',
        },
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : `UnknownError: ${reason}`),
      html('pre',
        source[0] === '\0'
          ? source.slice(source.search(/\n|$/) + 1).slice(0, 10001).replace(/^(.{9997}).{4}$/s, '$1...') || undefined
          : source || undefined),
    ], '']);
}
