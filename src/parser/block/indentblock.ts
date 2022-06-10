import { IndentBlockParser } from '../block';
import { union, block, indent, convert } from '../../combinator';
import { codeblock } from './codeblock';

// 空行を含むインデントブロックはインデントの違いによるセグメント分割の境界が視認不能となるため採用しない

export const indentblock: IndentBlockParser = block(indent(/^( {4}|\t)\1*/, convert(
  source => {
    const fence = (source.match(/^`{3,}(?=[^\S\n]*$)/mg) ?? [])
      .reduce((max, fence) => fence > max ? fence : max, '``') + '`';
    return `${fence}\n${source}\n${fence}`;
  },
  union([codeblock])), true));
