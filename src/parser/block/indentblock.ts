import { IndentBlockParser } from '../block';
import { union, block, indent, convert } from '../../combinator';
import { codeblock } from './codeblock';

// エディタのタブサイズは2が一般的であるため空白４＝タブ２で一貫しソーステキストの可読性は高まる。
// ビューアのタブサイズは4で空白３＝タブ１(空白４)だがビューアの空白幅は狭いためほぼ区別できない。
// 空行を含むインデントブロックはインデントの違いによるセグメント分割の境界が視認不能となるため行わない。

export const indentblock: IndentBlockParser = block(indent(/^(?: {4})+|^\t{2,}/, convert(
  source => {
    const fence = (source.match(/^`{3,}(?=[^\S\n]*$)/mg) ?? [])
      .reduce((max, fence) => fence > max ? fence : max, '``') + '`';
    return `${fence}\n${source}\n${fence}`;
  },
  union([codeblock])), true));
