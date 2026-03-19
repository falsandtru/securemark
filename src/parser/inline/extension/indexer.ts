import { ExtensionParser } from '../../inline';
import { List, Node } from '../../../combinator/data/parser';
import { union, validate, focus, surround } from '../../../combinator';
import { signature } from './index';
import { html } from 'typed-dom/dom';

// インデクスの重複解消は不要な重複を削除するのが最もよい。
// 複合生成インデクスは参照と同期させることが困難であり
// 複合生成インデクスを手動で同期させるより最初から重複のない
// テキストまたはインデクスを付けて同期が必要な機会を減らすのが
// 継続的編集において最も簡便となる。

export const indexer: ExtensionParser.IndexerParser = validate(' [|', surround(
  / \[(?=\|\S)/y,
  union([
    signature,
    focus(/\|(?=\])/y, () => new List([new Node(html('span', { class: 'indexer', 'data-index': '' }))])),
  ]),
  /\][^\S\r\n]*(?:$|\r?\n)/y));
