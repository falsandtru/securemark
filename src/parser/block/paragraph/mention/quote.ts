import { ParagraphParser } from '../../../block';
import { eval } from '../../../../combinator/data/parser';
import { union, some, block, validate, rewrite, creator, convert, lazy, fmap } from '../../../../combinator';
import { math } from '../../../inline/math';
import { contentline } from '../../../source';
import { autolink } from '../../../autolink';
import { html, defrag } from 'typed-dom';

export const syntax = /^>+(?!>|[0-9][0-9A-Za-z]*(?:-[0-9A-Za-z]+)*(?![^\S\n]*(?:$|\n)))/;

export const quote: ParagraphParser.MentionParser.QuoteParser = lazy(() => creator(block(fmap(validate(
  '>',
  rewrite(
    union([
      some(validate(/^>+(?:$|\s)/, contentline)),
      some(validate(syntax, contentline)),
    ]),
    union([convert(source => source.replace(/\n$/, ''), block_)]))),
  ns => [html('span', { class: 'quote' }, ns)]),
  false)));

const block_: ParagraphParser.MentionParser.QuoteParser.BlockParser = (source, context) => {
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
    if (child.classList.contains('quote')) {
      context.resources && (context.resources.budget -= child.childNodes.length);
      nodes.splice(i, 1, ...child.childNodes as NodeListOf<HTMLElement>);
      --i;
      continue;
    }
  }
  assert(nodes.every(n => typeof n === 'string' || n instanceof HTMLElement));
  assert(quotes.length === 0);
  return [defrag(nodes), ''];
};

const text: ParagraphParser.MentionParser.QuoteParser.TextParser = union([
  math,
  autolink,
]);
