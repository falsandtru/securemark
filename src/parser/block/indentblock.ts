import { IndentBlockParser } from '../block';
import { union, block, validate, indent, convert } from '../../combinator';
import { codeblock } from './codeblock';

// 空行を含むインデントブロックはインデントの違いによるセグメント分割の境界が視認不能となるため採用しない

export const indentblock: IndentBlockParser = block(validate(/^(?:  |\t)/, indent(convert(
  source => {
    const fence = (source.match(/^`{3,}(?=[^\S\n]*$)/mg) ?? [])
      .reduce((max, fence) => fence > max ? fence : max, '``') + '`';
    return `${fence}\n${source}\n${fence}`;
  },
  union([codeblock])), true)));
