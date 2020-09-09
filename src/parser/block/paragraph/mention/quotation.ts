import { ParagraphParser } from '../../../block';
import { union, some, block, validate, rewrite, creator, fmap, convert, lazy, eval } from '../../../../combinator';
import { defrag } from '../../../util';
import { math } from '../../../inline';
import { contentline } from '../../../source';
import { autolink } from '../../../autolink';
import { html } from 'typed-dom';

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
  const content = lines.reduce((acc, line, row) => acc + line.slice(quotes[row].length), '');
  const nodes = eval(some(text)(content, context), []);
  nodes.unshift(quotes.shift()!);
  for (let i = 0; i < nodes.length; ++i) {
    const child = nodes[i] as string | Text | Element;
    if (typeof child === 'string') continue;
    if ('wholeText' in child) {
      nodes[i] = child.data;
      continue;
    }
    assert(child instanceof HTMLElement);
    if (child.tagName === 'BR') {
      assert(quotes.length > 0);
      nodes.splice(i + 1, 0, quotes.shift()!);
      ++i;
      continue;
    }
    if (child.classList.contains('quotation')) {
      context.resources && (context.resources.creation -= child.childNodes.length);
      nodes.splice(i, 1, ...child.childNodes as NodeListOf<HTMLElement>);
      --i;
      continue;
    }
  }
  assert(nodes.every(n => typeof n === 'string' || n instanceof HTMLElement));
  assert(quotes.length === 0);
  return [defrag(nodes), ''];
};

const text: ParagraphParser.MentionParser.QuotationParser.TextParser = union([
  math,
  autolink,
]);
