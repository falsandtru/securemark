import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, creator, fmap, convert, lazy, eval } from '../../../../combinator';
import { defrag } from '../../../util';
import { math } from '../../../inline';
import { contentline } from '../../../source';
import { autolink } from '../../../autolink';
import { html } from 'typed-dom';

// コード、数式、ルビ、画像などテキストとして直接引用できないものは引用の際にテキストに自動変換されるようユーザー側で処理を追加しなければならない。
// コード・数式：ソーステキストに変換　ルビ：ルビを除去　画像：URLに変換
// TODO: ユーザーに提供する自動変換機能付き引用機能の実装

export const syntax = /^>+(?!>|[0-9][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*(?![^\S\n]*(?:$|\n)))/;

export const quotation: ParagraphParser.MentionParser.QuotationParser = lazy(() => creator(block(fmap(
  union([
    rewrite(
      some(validate(/^>+(?:$|\s)/, contentline)),
      convert(source => source.replace(/\n$/, ''), block_)),
    rewrite(
      some(validate(syntax, contentline)),
      convert(source => source.replace(/\n$/, ''), block_)),
  ]),
  ns => [html('span', { class: 'quotation' }, ns)]),
  false)));

const block_: ParagraphParser.MentionParser.QuotationParser.BlockParser = (source, context) => {
  const lines = source.match(/^.*\n?/mg)!;
  assert(lines);
  const quotes = source.match(/^>+(?:$|\s)/.test(source) ? /^>+(?:$|\s)/mg : /^>+/mg)!;
  assert(quotes);
  assert(quotes.length > 0);
  const block = lines.reduce((block, line, row) => block + line.slice(quotes[row].length), '');
  const ns = eval(some(text)(block, context), []);
  ns.unshift(quotes.shift()!);
  for (let i = 0; i < ns.length; ++i) {
    const child = ns[i] as string | Text | Element;
    if (typeof child === 'string') continue;
    if ('wholeText' in child) {
      ns[i] = child.data;
      continue;
    }
    assert(child instanceof HTMLElement);
    if (child.tagName === 'BR') {
      assert(quotes.length > 0);
      ns.splice(i + 1, 0, quotes.shift()!);
      ++i;
      continue;
    }
    if (child.classList.contains('quotation')) {
      context.resources && (context.resources.creation -= child.childNodes.length);
      ns.splice(i, 1, ...child.childNodes as NodeListOf<HTMLElement>);
      --i;
      continue;
    }
  }
  assert(ns.every(n => typeof n === 'string' || n instanceof HTMLElement));
  assert(quotes.length === 0);
  return [defrag(ns), ''];
};

const text: ParagraphParser.MentionParser.QuotationParser.TextParser = union([
  math,
  autolink,
]);
